# hexo-generator-author

Author generator for [Hexo].

## Installation

``` bash
$ npm install hexo-generator-author --save
```

## Usage

Add `author` in front matter.

``` yaml
author: Alice
```

You get `author` attribute in `post` variable and `authors` attribute in `site` variable. There is also a helper function `list_authors()`.

## Options

``` yaml
author_generator:
  per_page: 10
```

- **per_page**: Posts displayed per page. (0 = disable pagination)

### Example usage

Base on *hexo-theme-next*. See full change in branch [multiple-authors] of my fork.

``` diff
--- a/layout/_macro/post.swig
+++ b/layout/_macro/post.swig
@@ -47,6 +47,11 @@
         {% endif %}

         <div class="post-meta">
+          <span itemprop="about" itemscope itemtype="https://schema.org/Thing">
+            <a href="/authors/{{ post.author }}" itemprop="url" rel="index">
+              <span itemprop="name">{{ post.author }}</span>
+            </a>
+          </span>
           <span class="post-time">
             <span class="post-meta-item-icon">
               <i class="fa fa-calendar-o"></i>
```

``` diff
--- /dev/null
+++ b/layout/author.swig
@@ -0,0 +1,28 @@
+{% extends '_layout.swig' %}
+{% import '_macro/post-collapse.swig' as post_template %}
+{% import '_macro/sidebar.swig' as sidebar_template %}
+
+{% block title %} {{ __('title.author') }}: {{ page.author }} | {{ config.title }} {% endblock %}
+
+{% block content %}
+
+  <section id="posts" class="posts-collapse">
+    <div class="collection-title">
+      <h2 >
+        {{ page.author }}
+        <small>{{  __('title.author')  }}</small>
+      </h2>
+    </div>
+
+    {% for post in page.posts %}
+      {{ post_template.render(post) }}
+    {% endfor %}
+  </section>
+
+  {% include '_partials/pagination.swig' %}
+
+{% endblock %}
+
+{% block sidebar %}
+  {{ sidebar_template.render(false) }}
+{% endblock %}
```

``` diff
--- a/layout/page.swig
+++ b/layout/page.swig
@@ -8,6 +8,8 @@
     {{ __('title.category') + page_title_suffix }}
   {% elif page.type === "tags" %}
     {{ __('title.tag') + page_title_suffix }}
+  {% elif page.type === "authors" %}
+    {{ __('title.author') + page_title_suffix }}
   {% else %}
     {{ page.title + page_title_suffix }}
   {% endif %}
@@ -35,6 +37,15 @@
           {{ list_categories() }}
         </div>
       </div>
+    {% elif page.type === 'authors' %}
+      <div class="author-all-page">
+        <div class="author-all-title">
+            {{ _p('counter.authors', site.authors.length) }}
+        </div>
+        <div class="author-all">
+          {{ list_authors() }}
+        </div>
+      </div>
     {% else %}
       {{ page.content }}
     {% endif %}
```

## License

MIT

[Hexo]: http://hexo.io
[multiple-authors]: https://github.com/iissnan/hexo-theme-next/compare/master...qzchenwl:multiple-authors?expand=1
