#import <GoogleAnalytics/GAIDictionaryBuilder.h>
#import <GoogleAnalytics/GAIFields.h>
#import <Analytics/SEGAnalyticsUtils.h>
#import <Analytics/SEGAnalytics.h>
#import "SEGGoogleAnalyticsIntegration.h"


@implementation SEGGoogleAnalyticsIntegration

- (id)initWithSettings:(NSDictionary *)settings
{
    if (self = [super init]) {
        self.settings = settings;
        // Require setup with the trackingId.
        NSString *trackingId = [settings objectForKey:@"mobileTrackingId"];
        self.tracker = [[GAI sharedInstance] trackerWithTrackingId:trackingId];
        [[GAI sharedInstance] setDefaultTracker:self.tracker];

        // Optionally turn on uncaught exception tracking.
        NSString *reportUncaughtExceptions = [settings objectForKey:@"reportUncaughtExceptions"];
        if ([reportUncaughtExceptions boolValue]) {
            [GAI sharedInstance].trackUncaughtExceptions = YES;
            SEGLog(@"[[GAI sharedInstance] defaultTracker] trackUncaughtExceptions = YES;");
        }

        // Optionally turn on GA remarketing features
        NSString *demographicReports = [settings objectForKey:@"doubleClick"];
        if ([demographicReports boolValue]) {
            [self.tracker setAllowIDFACollection:YES];
            SEGLog(@"[[[GAI sharedInstance] defaultTracker] setAllowIDFACollection:YES];");
        }
    }
    return self;
}

- (void)identify:(SEGIdentifyPayload *)payload
{
    // remove existing traits
    [self resetTraits];

    if (self.shouldSendUserId && payload.userId) {
        [self.tracker set:@"&uid" value:payload.userId];
        SEGLog(@"[[[GAI sharedInstance] defaultTracker] set:&uid value:%@];", payload.userId);
    }

    self.traits = payload.traits;

    [self.traits enumerateKeysAndObjectsUsingBlock:^(id key, id obj, BOOL *stop) {
        [self.tracker set:key value:obj];
        SEGLog(@"[[[GAI sharedInstance] defaultTracker] set:%@ value:%@];", key, obj);
    }];

    [self setCustomDimensionsAndMetricsOnDefaultTracker:payload.traits];
}

+ (NSNumber *)extractRevenue:(NSDictionary *)dictionary withKey:(NSString *)revenueKey
{
    id revenueProperty = nil;

    for (NSString *key in dictionary.allKeys) {
        if ([key caseInsensitiveCompare:revenueKey] == NSOrderedSame) {
            revenueProperty = dictionary[key];
            break;
        }
    }

    if (revenueProperty) {
        if ([revenueProperty isKindOfClass:[NSString class]]) {
            // Format the revenue.
            NSNumberFormatter *formatter = [[NSNumberFormatter alloc] init];
            [formatter setNumberStyle:NSNumberFormatterDecimalStyle];
            return [formatter numberFromString:revenueProperty];
        } else if ([revenueProperty isKindOfClass:[NSNumber class]]) {
            return revenueProperty;
        }
    }
    return nil;
}

- (void)track:(SEGTrackPayload *)payload
{
    // Try to extract a "category" property.
    NSString *category = @"All"; // default
    NSString *categoryProperty = [payload.properties objectForKey:@"category"];
    if (categoryProperty) {
        category = categoryProperty;
    }

    // Try to extract a "label" property.
    NSString *label = [payload.properties objectForKey:@"label"];

    // Try to extract a "revenue" or "value" property.
    NSNumber *value = [SEGGoogleAnalyticsIntegration extractRevenue:payload.properties withKey:@"revenue"];
    NSNumber *valueFallback = [SEGGoogleAnalyticsIntegration extractRevenue:payload.properties withKey:@"value"];
    if (!value && valueFallback) {
        // fall back to the "value" property
        value = valueFallback;
    }

    GAIDictionaryBuilder *hitBuilder =
        [GAIDictionaryBuilder createEventWithCategory:category
                                               action:payload.event
                                                label:label
                                                value:value];
    NSDictionary *hit = [self setCustomDimensionsAndMetrics:payload.properties onHit:hitBuilder];
    [self.tracker send:hit];
    SEGLog(@"[[[GAI sharedInstance] defaultTracker] send:%@];", hit);
}

- (void)screen:(SEGScreenPayload *)payload
{
    [self.tracker set:kGAIScreenName value:payload.name];
    SEGLog(@"[[[GAI sharedInstance] defaultTracker] set:%@ value:%@];", kGAIScreenName, payload.name);

    GAIDictionaryBuilder *hitBuilder = [GAIDictionaryBuilder createScreenView];
    NSDictionary *hit = [self setCustomDimensionsAndMetrics:payload.properties onHit:hitBuilder];
    [self.tracker send:hit];
    SEGLog(@"[[[GAI sharedInstance] defaultTracker] send:%@];", hit);
}

#pragma mark - Ecommerce

- (void)completedOrder:(NSDictionary *)properties
{
    NSString *orderId = properties[@"orderId"];
    NSString *currency = properties[@"currency"] ?: @"USD";

    NSDictionary *transaction = [[GAIDictionaryBuilder createTransactionWithId:orderId
                                                                   affiliation:properties[@"affiliation"]
                                                                       revenue:[SEGGoogleAnalyticsIntegration extractRevenue:properties withKey:@"revenue"]
                                                                           tax:properties[@"tax"]
                                                                      shipping:properties[@"shipping"]
                                                                  currencyCode:currency] build];
    [self.tracker send:transaction];
    SEGLog(@"[[[GAI sharedInstance] defaultTracker] send:%@];", transaction);

    NSDictionary *item = [[GAIDictionaryBuilder createItemWithTransactionId:orderId
                                                                       name:properties[@"name"]
                                                                        sku:properties[@"sku"]
                                                                   category:properties[@"category"]
                                                                      price:properties[@"price"]
                                                                   quantity:properties[@"quantity"]
                                                               currencyCode:currency] build];
    [self.tracker send:item];
    SEGLog(@"[[[GAI sharedInstance] defaultTracker] send:%@];", item);
}

- (void)reset
{
    [self.tracker set:@"&uid" value:nil];
    SEGLog(@"[[[GAI sharedInstance] defaultTracker] set:&uid value:nil];");

    [self resetTraits];
}


- (void)flush
{
    [[GAI sharedInstance] dispatch];
}

#pragma mark - Private

// event and screen properties are generall hit-scoped dimensions, so we want
// to set them on the hits, not the tracker
- (NSDictionary *)setCustomDimensionsAndMetrics:(NSDictionary *)properties onHit:(GAIDictionaryBuilder *)hit
{
    NSDictionary *customDimensions = self.settings[@"dimensions"];
    NSDictionary *customMetrics = self.settings[@"metrics"];

    for (NSString *key in properties) {
        NSString *dimensionString = [customDimensions objectForKey:key];
        NSUInteger dimension = [self extractNumber:dimensionString from:[@"dimension" length]];
        if (dimension != 0) {
            [hit set:[properties objectForKey:key]
                forKey:[GAIFields customDimensionForIndex:dimension]];
        }

        NSString *metricString = [customMetrics objectForKey:key];
        NSUInteger metric = [self extractNumber:metricString from:[@"metric" length]];
        if (metric != 0) {
            [hit set:[properties objectForKey:key]
                forKey:[GAIFields customMetricForIndex:metric]];
        }
    }

    return [hit build];
}

// e.g. extractNumber:"dimension3" from:[@"dimension" length] returns 3
// e.g. extractNumber:"metric9" from:[@"metric" length] returns 9
- (int)extractNumber:(NSString *)text from:(NSUInteger)start
{
    if (text == nil || [text length] == 0) {
        return 0;
    }
    return [[text substringFromIndex:start] intValue];
}

// traits are user-scoped dimensions. as such, it makes sense to set them on the tracker
- (void)setCustomDimensionsAndMetricsOnDefaultTracker:(NSDictionary *)traits
{
    NSDictionary *customDimensions = self.settings[@"dimensions"];
    NSDictionary *customMetrics = self.settings[@"metrics"];

    for (NSString *key in traits) {
        NSString *dimensionString = [customDimensions objectForKey:key];
        NSUInteger dimension = [self extractNumber:dimensionString from:[@"dimension" length]];
        if (dimension != 0) {
            [self.tracker set:[GAIFields customDimensionForIndex:dimension]
                        value:[traits objectForKey:key]];
        }

        NSString *metricString = [customMetrics objectForKey:key];
        NSUInteger metric = [self extractNumber:metricString from:[@"metric" length]];
        if (metric != 0) {
            [self.tracker set:[GAIFields customMetricForIndex:metric]
                        value:[traits objectForKey:key]];
        }
    }
}

- (BOOL)shouldSendUserId
{
    return [[self.settings objectForKey:@"sendUserId"] boolValue];
}

- (void)resetTraits
{
    [self.traits enumerateKeysAndObjectsUsingBlock:^(id key, id obj, BOOL *stop) {
        [self.tracker set:key value:nil];
        SEGLog(@"[[[GAI sharedInstance] defaultTracker] set:%@ value:nil];", key);
    }];
    self.traits = nil;
}

@end
