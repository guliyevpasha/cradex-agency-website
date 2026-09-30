import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '7ia9tt83',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function testMediaGallery() {
  console.log('🔍 Testing Sanity media gallery data...\n')

  const query = `*[_type == "portfolio" && category == "smm"][0] {
    "id": _id,
    "slug": slug.current,
    "title": title.az,
    "category": category,
    "mediaGallery": {
      "socialMediaPosts": mediaGallery.socialMediaPosts[]{
        "url": asset->url,
        "caption": caption.az
      },
      "motionDesigns": mediaGallery.motionDesigns[]{
        "url": asset->url,
        "mimeType": asset->mimeType,
        "originalFilename": asset->originalFilename,
        "caption": caption.az
      },
      "videoContent": mediaGallery.videoContent[]{
        "url": asset->url,
        "mimeType": asset->mimeType,
        "originalFilename": asset->originalFilename,
        "caption": caption.az
      },
      "adResults": mediaGallery.adResults[]{
        "url": asset->url,
        "caption": caption.az
      }
    }
  }`

  try {
    const result = await client.fetch(query)
    
    console.log('✅ Query successful!\n')
    console.log('Project:', result?.title || 'No title')
    console.log('Category:', result?.category || 'No category')
    console.log('\n📊 Media Gallery Results:\n')
    
    if (result?.mediaGallery) {
      console.log('Social Media Posts:', result.mediaGallery.socialMediaPosts?.length || 0)
      if (result.mediaGallery.socialMediaPosts?.length > 0) {
        console.log('  First post URL:', result.mediaGallery.socialMediaPosts[0].url)
      }
      
      console.log('\nMotion Designs:', result.mediaGallery.motionDesigns?.length || 0)
      if (result.mediaGallery.motionDesigns?.length > 0) {
        result.mediaGallery.motionDesigns.forEach((motion, i) => {
          console.log(`  Motion ${i + 1}:`)
          console.log(`    URL: ${motion.url || 'NULL'}`)
          console.log(`    MIME: ${motion.mimeType || 'NULL'}`)
          console.log(`    File: ${motion.originalFilename || 'NULL'}`)
          console.log(`    Caption: ${motion.caption || 'No caption'}`)
        })
      }
      
      console.log('\nVideo Content:', result.mediaGallery.videoContent?.length || 0)
      if (result.mediaGallery.videoContent?.length > 0) {
        result.mediaGallery.videoContent.forEach((video, i) => {
          console.log(`  Video ${i + 1}:`)
          console.log(`    URL: ${video.url || 'NULL'}`)
          console.log(`    MIME: ${video.mimeType || 'NULL'}`)
          console.log(`    File: ${video.originalFilename || 'NULL'}`)
          console.log(`    Caption: ${video.caption || 'No caption'}`)
        })
      }
      
      console.log('\nAd Results:', result.mediaGallery.adResults?.length || 0)
      if (result.mediaGallery.adResults?.length > 0) {
        console.log('  First result URL:', result.mediaGallery.adResults[0].url)
      }
    } else {
      console.log('❌ No mediaGallery data found')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testMediaGallery()
