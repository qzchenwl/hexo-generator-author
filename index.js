'use strict';

var pagination = require('hexo-pagination');

if (typeof Array.prototype.unique === 'undefined') {
    Array.prototype.unique = function() { return Array.from(new Set(this)); };
}

hexo.extend.filter.register('template_locals', function(locals) {
    if (typeof locals.site.authors === 'undefined') {
        locals.site.authors = locals.site.posts.map(post => post.author).unique();
    }
});

hexo.extend.helper.register('list_authors', function() {
    const authors = this.site.authors.map(author => '<li class="author-list-item"><a class="author-list-link" href="AUTHOR">AUTHOR</a><span class="author-list-count">COUNT</span></li>'.replace(/AUTHOR/g, author).replace(/COUNT/g, this.site.posts.filter(post => post.author === author).length)).join('');

    return '<ul class="author-list">AUTHORS</ul>'.replace(/AUTHORS/g, authors);
});

hexo.extend.generator.register("author", function(locals) {
    const posts = locals.posts;
    const authors = posts.map(post => post.author).unique().map(author => ({name: author, posts: posts.find({author})}));
    const generator_config = this.config.author_generator || {};
    const per_page = generator_config.per_page || this.config.per_page || 10;
    return authors.reduce((result, author) => {
        const posts = author.posts.sort('-date');
        const data = pagination('authors/' + author.name, posts, {
            layout: ['author', 'archive', 'index'],
            perPage: per_page,
            data: {
                author: author.name
            }
        });
        return result.concat(data);
    }, []);
});
