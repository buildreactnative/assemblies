const BASE_URL = 'http://162.243.209.229:5000'; // comment out to run locally
// const BASE_URL = 'http://localhost:2403';

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
  maxWidth: 100, // photos only
  maxHeight: 100, // photos only
  aspectX: 2, // aspectX:aspectY, the cropping image's ratio of width to height
  aspectY: 1, // aspectX:aspectY, the cropping image's ratio of width to height
  quality: 0.2, // photos only
  angle: 0, // photos only
  allowsEditing: false, // Built in functionality to resize/reposition the image
  noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
  storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
    skipBackup: true, // image will NOT be backed up to icloud
    path: 'images' // will save image at /Documents/images rather than the root
  }
};
module.exports = {TECHNOLOGIES, IMAGE_OPTIONS, BASE_URL}
