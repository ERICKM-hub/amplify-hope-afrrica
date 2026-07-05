import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const contentDirectory = path.join(process.cwd(), 'src/content')

export interface BlogPost {
  slug: string
  title: string
  date: string
  author?: string
  category: string
  excerpt: string
  content: string
  featuredImage?: string
  tags?: string[]
}

export async function getMDXContent(filePath: string) {
  const fullPath = path.join(contentDirectory, filePath)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  return { data, content }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const blogDirectory = path.join(contentDirectory, 'blog')
  const filenames = fs.readdirSync(blogDirectory)
  
  const posts = filenames
    .filter((filename) => filename.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '')
      const fullPath = path.join(blogDirectory, filename)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      return {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString().split('T')[0],
        author: data.author || 'Amplify Hope Africa',
        category: data.category || 'Updates',
        excerpt: data.excerpt || content.slice(0, 150) + '...',
        content,
        featuredImage: data.featuredImage || null,
        tags: data.tags || [],
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  return posts
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(contentDirectory, 'blog', `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    // Convert markdown to HTML
    const processedContent = await remark()
      .use(html, { sanitize: false })
      .process(content)
    const contentHtml = processedContent.toString()

    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString().split('T')[0],
      author: data.author || 'Amplify Hope Africa',
      category: data.category || 'Updates',
      excerpt: data.excerpt || content.slice(0, 150) + '...',
      content: contentHtml,
      featuredImage: data.featuredImage || null,
      tags: data.tags || [],
    }
  } catch (error) {
    return null
  }
}
