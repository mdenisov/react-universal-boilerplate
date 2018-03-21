import Boom from 'boom';

const posts = [
  {
    id: 1, name: 'Admin', title: 'Events management in javascript', slug: 'events-management-in-javascript', content: '&lt;p&gt;Suppose I have my form section in html file and an onclick event is associated with one of the input of type submit ,so when submit input is clicked ,I have to call one function that is present in external javascript file.&lt;/p&gt;&lt;p&gt;Case 1: As per standard rule we should keep our script tag at the end because of effective page loading.&lt;/p&gt;&lt;p&gt;But suppose if we follow the case 1 scenario and some how that onclick event is triggered which I have mentioned above but external javascript file is still not loaded ,so it will definitely give an error.&lt;/p&gt;&lt;p&gt;So I was wondering Is there any effective solution to handle this kind of scenario i.e. onclick event will only triggered when all your external javascript file is loaded.&lt;/p&gt;',
  },
  {
    id: 2, name: 'Admin', title: 'Hello 2', slug: 'hello-2', content: 'content',
  },
  {
    id: 3, name: 'Admin', title: 'Hello 3', slug: 'hello-3', content: 'content',
  },
  {
    id: 4, name: 'Admin', title: 'Hello 4', slug: 'hello-4', content: 'content',
  },
  {
    id: 5, name: 'Admin', title: 'Hello 5', slug: 'hello-5', content: 'content',
  },
];

/**
 * Get all posts
 * @param ctx
 * @returns void
 */
async function list(ctx) {
  ctx.body = posts.sort((a, b) => b.id - a.id);
}

/**
 * Save a post
 * @param ctx
 * @returns void
 */
async function create(ctx) {
  if (
    !ctx.request.body.post.name ||
    !ctx.request.body.post.title ||
    !ctx.request.body.post.content
  ) {
    ctx.throw(Boom.badRequest('Invalid query.'));
  } else {
    const id = posts[0].id + 1;
    const saved = {
      ...ctx.request.body.post,
      slug: `${ctx.request.body.post.title}-${id}`,
      id,
    };

    posts.push(saved);

    ctx.status = 201;
    ctx.body = saved;
  }
}

/**
 * Get a single post by slug
 * @param ctx
 * @returns void
 */
async function get(ctx) {
  const { slug } = ctx.request.body;
  const post = posts.find(item => item.slug === slug);

  if (post) {
    ctx.body = post;
  } else {
    ctx.throw(Boom.notFound('That post does not exist.'));
  }
}

/**
 * Delete a post by slug
 * @param ctx
 * @returns void
 */
async function remove(ctx) {
  const { slug } = ctx.request.body;
  const post = posts.find(item => item.slug === slug);

  if (post) {
    ctx.status = 204;
    ctx.body = null;
  } else {
    ctx.throw(Boom.notFound('That post does not exist.'));
  }
}

export default {
  list,
  get,
  create,
  remove,
};
