'use strict';

var pagination = require('hexo-pagination');

if (typeof Array.prototype.unique === 'undefined') {
    Array.prototype.unique = function() { return Array.from(new Set(this)); };
}

function author_to_url(author) {
    return ((this.config.author_generator || {}).url_map || {})[author] || author;
}

hexo.extend.filter.register('template_locals', function(locals) {
    if (typeof locals.site.authors === 'undefined') {
        locals.site.authors = locals.site.posts.map(post => post.author).unique();
    }
});

hexo.extend.helper.register('list_authors', function() {
    const count_posts = author => this.site.posts.filter(post => post.author === author).length;
    const authors = this.site.authors.map(author => `
        <li class="author-list-item">
            <a class="author-list-link" href="${author_to_url.call(this, author)}">${author}</a>
            <span class="author-list-count">${count_posts(author)}</span>
        </li>`).join('');

    return `<ul class="author-list">${authors}</ul>`;
});

hexo.extend.helper.register('author_to_url', function(author) {
    return author_to_url.call(this, author);
});

hexo.extend.generator.register("author", function(locals) {
    const posts = locals.posts;
    const authors = posts.map(post => post.author).unique().map(author => ({name: author, posts: posts.find({author})}));
    const generator_config = this.config.author_generator || {};
    const per_page = generator_config.per_page || this.config.per_page || 10;
    return authors.reduce((result, author) => {
        const posts = author.posts.sort('-date');
        const data = pagination('authors/' + author_to_url.call(this, author.name), posts, {
            layout: ['author', 'archive', 'index'],
            perPage: per_page,
            data: {
                author: author.name
            }
        });
        return result.concat(data);
    }, []);
});
