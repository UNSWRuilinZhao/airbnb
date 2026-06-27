function blobToBase64 (blob, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    callback(reader.result);
  });
  reader.readAsDataURL(blob);
}

export default {
  blobToBase64
}
