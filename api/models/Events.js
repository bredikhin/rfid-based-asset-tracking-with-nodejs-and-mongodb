/**
 * Events
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {
  	/* e.g.
  	nickname: 'string'
  	*/    
  },
  
  // Lifecycle Callbacks
  beforeCreate: function(values, next) {
    Tags.findOne({'tag': values['tag'].toString()}, function(err, tag) {
      if (err)
        return next(err);
      if (!tag)
        return next(new Error("No tags with the following parameters were found: {'tag': " + values['tag'] + "}"));
      Assets.findOne({'tagID': tag.id}, function(err, asset) {
        if (err)
          return next(err);
        if (!asset)
          return next(new Error("No assets assigned to the following tag were found: {'tag': " + values['tag'] + "}"));
        Readers.findOne({'reader': values['reader'].toString()}, function(err, reader) {
          if (err)
            return next(err);
          if (!reader)
            return next(new Error("No readers with the following parameters were found: {'reader': " + values['reader'] + "}"));
          if (asset.currentReaderId === reader.id)
            next();
          else {
            asset.currentReaderId = reader.id;
            asset.save(function(err) {
              if (err)
                return next(err);
              next();
            });
          }
        });
      });
    });
  }
};
