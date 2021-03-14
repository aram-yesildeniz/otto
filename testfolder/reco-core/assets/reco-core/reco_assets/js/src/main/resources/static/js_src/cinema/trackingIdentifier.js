function generate() {
  return 'ft6bcn_' + (+new Date).toString(36).slice(-5);
}

module.exports = {
  generate
};
