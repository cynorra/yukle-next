const fs = require('fs');
const fsPromises = require('fs/promises');

function patchError(err, path) {
  if (err && err.code === 'EISDIR') {
    const newErr = new Error(`EINVAL: invalid argument, readlink '${path}'`);
    newErr.code = 'EINVAL';
    newErr.errno = -4071; // Windows EINVAL error code
    newErr.syscall = 'readlink';
    newErr.path = path;
    return newErr;
  }
  return err;
}

// 1. Patch fs.readlink
const originalReadlink = fs.readlink;
fs.readlink = function (path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  originalReadlink(path, options, (err, linkString) => {
    if (err) {
      return callback(patchError(err, path));
    }
    callback(null, linkString);
  });
};

// 2. Patch fs.readlinkSync
const originalReadlinkSync = fs.readlinkSync;
fs.readlinkSync = function (path, options) {
  try {
    return originalReadlinkSync(path, options);
  } catch (err) {
    throw patchError(err, path);
  }
};

// 3. Patch fs.promises.readlink
if (fs.promises && fs.promises.readlink) {
  const originalPromisesReadlink = fs.promises.readlink;
  fs.promises.readlink = async function (path, options) {
    try {
      return await originalPromisesReadlink(path, options);
    } catch (err) {
      throw patchError(err, path);
    }
  };
}

// 4. Patch fs/promises readlink
if (fsPromises && fsPromises.readlink) {
  const originalFsPromisesReadlink = fsPromises.readlink;
  fsPromises.readlink = async function (path, options) {
    try {
      return await originalFsPromisesReadlink(path, options);
    } catch (err) {
      throw patchError(err, path);
    }
  };
}

console.log('Successfully loaded Node.js exFAT readlink monkey-patch.');
