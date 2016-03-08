const BASE_URL = 'http://162.243.209.229:5000'; // comment out to run locally
// const BASE_URL = 'http://localhost:2403';

const DEV = true;

const TIMES_RANGE = [
  '12:00 am',
  '12:30 am',
  '1:00 am',
  '1:30 am',
  '2:00 am',
  '2:30 am',
  '3:00 am',
  '3:30 am',
  '4:00 am',
  '4:30 am',
  '5:00 am',
  '5:30 am',
  '6:00 am',
  '6:30 am',
  '7:00 am',
  '7:30 am',
  '8:00 am',
  '8:30 am',
  '9:00 am',
  '9:30 am',
  '10:00 am',
  '10:30 am',
  '11:00 am',
  '11:30 am',
  '12:00 pm',
  '12:30 pm',
  '1:00 pm',
  '1:30 pm',
  '2:00 pm',
  '2:30 pm',
  '3:00 pm',
  '3:30 pm',
  '4:00 pm',
  '4:30 pm',
  '5:00 pm',
  '5:30 pm',
  '6:00 pm',
  '6:30 pm',
  '7:00 pm',
  '7:30 pm',
  '8:00 pm',
  '8:30 pm',
  '9:00 pm',
  '9:30 pm',
  '10:00 pm',
  '10:30 pm',
  '11:00 pm',
  '11:30 pm',
];

const TECHNOLOGIES = [
  'JavaScript',
  'Python',
  'Java',
  'Product Management',
  'Business Development',
  'Ruby',
  'Haskell',
  'Hadoop',
  'Machine Learning',
  'Natural Language Processing',
  'Elm',
  'Redux',
  'React Native',
];

const IMAGE_OPTIONS = {
  title: 'Select Avatar', // specify null or empty string to remove the title
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
  chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
  cameraType: 'back', // 'front' or 'back'
  mediaType: 'photo', // 'photo' or 'video'
  videoQuality: 'high', // 'low', 'medium', or 'high'
  maxWidth: 200, // photos only
  maxHeight: 200, // photos only
  aspectX: 1, // aspectX:aspectY, the cropping image's ratio of width to height
  aspectY: 1, // aspectX:aspectY, the cropping image's ratio of width to height
  quality: 1, // photos only
  angle: 0, // photos only
  allowsEditing: false, // Built in functionality to resize/reposition the image
  noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
  storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
    skipBackup: true, // image will NOT be backed up to icloud
    path: 'images' // will save image at /Documents/images rather than the root
  }
};
module.exports = {TECHNOLOGIES, IMAGE_OPTIONS, BASE_URL, TIMES_RANGE, DEV}
