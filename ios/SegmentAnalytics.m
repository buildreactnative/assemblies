//
//  SegmentAnalytics.m
//  assembly
//
//  Created by Thomas Goldenberg on 2/21/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SegmentAnalytics.h"
#import <Analytics/SEGAnalytics.h>

@implementation SegmentAnalytics

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(identify: (NSString*)userId){
//  [SEGAnalytics debug:YES];
  [[SEGAnalytics sharedAnalytics] identify: userId];
}

RCT_EXPORT_METHOD(signup: (NSString*)email){
//   [SEGAnalytics debug:YES];
  [[SEGAnalytics sharedAnalytics] track:@"signup" properties: @{@"email": email, @"type": @"signup"}];
}
RCT_EXPORT_METHOD(login: (NSString*)userId){
//  [SEGAnalytics debug:YES];
  [[SEGAnalytics sharedAnalytics] track:@"signup" properties: @{@"userId": userId, @"type": @"login"}];
}

@end