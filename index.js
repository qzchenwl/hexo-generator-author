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

    return authors.reduce((result, author) => {
        var posts = author.posts.sort('-date');
        var author_name = author.name;
        if(author_name){
            author_name = author_name.replace(' ','-');
        }
        var data = pagination('authors/' + author_name, posts, {
            layout: ['author', 'archive', 'index'],
            data: {
                author: author.name
            }
        });
        return result.concat(data);
    }, []);
});
