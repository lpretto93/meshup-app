const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    handlePreview(e);
    handleAvatarUpload(file);
  }
};