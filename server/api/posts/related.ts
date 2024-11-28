import { Client } from '@notionhq/client'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { tag, currentSlug } = query

  if (!tag) {
    return [] // タグがない場合は空配列を返す
  }

  try {
    const notion = new Client({
      auth: process.env.NOTION_API_KEY
    })

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID as string,
      filter: {
        and: [
          {
            property: 'Tags',
            multi_select: {
              contains: tag as string
            }
          },
          {
            property: 'Published',
            checkbox: {
              equals: true
            }
          },
          {
            property: 'Slug',
            rich_text: {
              does_not_equal: currentSlug as string
            }
          }
        ]
      },
      page_size: 3,
      sorts: [
        {
          property: 'Date',
          direction: 'descending'
        }
      ]
    })

    // レスポンスの形式を単純化
    const relatedPosts = response.results.map(page => {
      const props = page.properties as any
      return {
        title: props.Name?.title[0]?.plain_text || '',
        slug: props.Slug?.rich_text[0]?.plain_text || '',
        date: props.Date?.date?.start || '',
        thumbnail: props.Thumbnail?.files[0]?.file?.url || 
                  props.Thumbnail?.files[0]?.external?.url || 
                  null
      }
    })

    // デバッグログ
    console.log('Found related posts:', relatedPosts)
    
    return relatedPosts

  } catch (error: any) {
    console.error('Error fetching related posts:', error)
    return [] // エラー時は空配列を返す
  }
}) 