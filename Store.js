var sqlite3 = require('sqlite3').verbose(),
  _ = require('underscore'),
  marked = require('marked');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

function Store(db) {
  this.db = new sqlite3.Database(db);
}

Store.prototype.save = function(data, callback) {
  this.db.serialize(function() {
    if (_.has(data, 'slug') && data.slug !== null) {
    	data.content = data.content.replace('/uploads/', '/content/images/');
      var htmlContent = marked(data.content);
      var query = this.db.prepare("INSERT INTO posts (uuid, title, slug, markdown, featured, page, status, language, author_id, created_at, created_by, updated_at, updated_by, published_at, published_by, html) VALUES (?, ?, ?, ?, 0, ?, ?, 'en_GB', 1, ?, 1, ?, 1, ?, 1, ?)", data.uuid, data.title, data.slug, data.content, data.layout === 'post' ? 0 : 1, data.published ? 'published' : 'draft', data.created_at, data.updated_at, data.created_at, htmlContent);
      query.run();
      query.finalize();
    }

    if (typeof callback === 'function') {
      callback();
    }
  }.bind(this));
};

Store.prototype.close = function() {
  this.db.close();
};

module.exports = exports = Store;
