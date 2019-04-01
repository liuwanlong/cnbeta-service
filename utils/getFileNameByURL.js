getFileNameByURL = (url) => {
  let parts = url.split('/');
  return parts[parts.length - 1];
};

module.exports = getFileNameByURL;