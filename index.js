(function() {

  'use strict';

  var data = require('./src/data');
  var raw = __dirname + '/data/raw/';

  /**
   * @description
   * Get the results of a previously run test.
   *
   * @return {Promise}
   */
  module.exports.results = function() {
    return data.read(raw);
  };

  /**
   * @description
   * Regenerate results based on the most recent files in the images directory, gather
   * the file size, quality loss, and score for each file.
   *
   * @return {Promise}
   */
  module.exports.compare = function() {
    return data.gather().then(
      data.write.bind(null, raw)
    );
  };

}());
