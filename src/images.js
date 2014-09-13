/**
 * @module images
 */
(function() {

  'use strict';

  var path = require('path');
  var deferred = require('deferred');

  var terminal = require('./terminal');
  var OptimisedImage = require('./optimisedimage');
  var directory = path.resolve(__dirname + '/../images');

  /**
   * @description
   * Returns a collection of models representing each image in the /images directory.
   *
   * @return {OptimisedImageGroup}
   */
  exports.get = function() {
    return terminal.findAllImages(directory)
      .then(function(paths) {
        return paths.map(OptimisedImage.create);
      })
      .then(function(results) {
        return results.reduce(function(memo, img) {
          memo.ImagesByTool[img.tool] = memo.ImagesByTool[img.tool] || [];
          memo.ImagesByTool[img.tool].push(img);
          memo.ImagesByName[img.name] = memo.ImagesByName[img.name] || [];
          memo.ImagesByName[img.name].push(img);
          memo.ImagesByToolByName[img.tool] = memo.ImagesByToolByName[img.tool] || {};
          memo.ImagesByToolByName[img.tool][img.name] = img;
          memo.ImagesByNameByTool[img.name] = memo.ImagesByNameByTool[img.name] || {};
          memo.ImagesByNameByTool[img.name][img.tool] = img;
          return memo;
        }, {
          Images: results,
          ImagesByTool: {},
          ImagesByName: {},
          ImagesByToolByName: {},
          ImagesByNameByTool: {}
        });
      });
  };

  /**
   * @description
   * Gather the statistical quality loss for each image in the /images directory compared to the
   * original in /images/photoshop and reference in /image/worst.
   *
   * @param {OptimisedImageGroup} results
   * @return {Promise}
   */
  exports.setLoss = function(results) {
    var measureImages = deferred.map(results.Images, deferred.gate(function(result, ix, list) {
      var original = results.ImagesByToolByName.photoshop[result.name];
      return result.compareTo(original);
    }, 50));
    return measureImages().then(function() {
      return results;
    });
  };

  /**
   * @description
   * Gather the file size for each image in the /images directory.
   *
   * @param {OptimisedImageGroup} results
   * @return {Promise}
   */
  exports.setSize = function(results) {
    var measureImages = deferred.map(results.Images, deferred.gate(function(result, ix, list) {
      return result.setFileSize();
    }, 50));
    return measureImages().then(function() {
      return results;
    });
  };

  /**
   * @description
   * Gather what percentage of each file's size was removed, how many bytes were removed, and what
   * percentage of the maximum possible quality loss was incurred as a result.
   *
   * @param {OptimisedImageGroup} results
   * @return {OptimisedImageGroup}
   */
  exports.setDifferences = function(results) {
    results.Images.forEach(function(result) {
      var original = results.ImagesByToolByName.photoshop[result.name];
      var worst = results.ImagesByToolByName.worst[result.name];
      result.sizeSaving = original.size - result.size;
      result.sizeSavingPercent = (result.sizeSaving / original.size) * 100;
      result.qualityLossPercent = 0;
      if (worst && result.meanErrorSquared) {
        result.qualityLossPercent = (result.meanErrorSquared / worst.meanErrorSquared) * 100;
      }
    });
    return results;
  };

  /**
   * @description
   * Clean up any temporary data needed when gathering statistics.
   *
   * @param  {OptimisedImageGroup} results
   * @return {OptimisedImageGroup}
   */
  exports.finish = function(results) {
    results.Images.forEach(function(result) {
      result.finish();
    });
    return results;
  };

}());
