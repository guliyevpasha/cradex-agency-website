/**
 * GitHub API Integration for Auto-Commit
 * Commits JSON file changes to GitHub repository
 */

interface GitHubFileResponse {
  sha: string
  content: string
}

interface CommitOptions {
  filePath: string
  content: string
  message: string
}

/**
 * Get file from GitHub repository
 */
async function getFileFromGitHub(filePath: string): Promise<GitHubFileResponse | null> {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO || 'guliyevpasha/cradex-agency-website'
  const branch = process.env.GITHUB_BRANCH || 'main'

  if (!token) {
    console.error('[GitHub] GITHUB_TOKEN not set in environment variables')
    return null
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        // File doesn't exist yet
        return null
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      sha: data.sha,
      content: data.content,
    }
  } catch (error) {
    console.error('[GitHub] Error getting file:', error)
    return null
  }
}

/**
 * Commit file to GitHub repository
 */
export async function commitToGitHub({ filePath, content, message }: CommitOptions): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO || 'guliyevpasha/cradex-agency-website'
  const branch = process.env.GITHUB_BRANCH || 'main'

  if (!token) {
    console.error('[GitHub] GITHUB_TOKEN not set in environment variables')
    throw new Error('GitHub token not configured')
  }

  try {
    // Get current file SHA (required for update)
    const currentFile = await getFileFromGitHub(filePath)

    // Encode content to base64
    const contentBase64 = Buffer.from(content).toString('base64')

    // Prepare request body
    const body: any = {
      message,
      content: contentBase64,
      branch,
    }

    // Add SHA if file exists (for update)
    if (currentFile?.sha) {
      body.sha = currentFile.sha
    }

    // Commit to GitHub
    const response = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('[GitHub] Commit failed:', errorData)
      throw new Error(`GitHub commit failed: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    console.log('[GitHub] Commit successful:', data.commit.sha)
    
    return true
  } catch (error) {
    console.error('[GitHub] Error committing to GitHub:', error)
    throw error
  }
}

/**
 * Generate commit message for content changes
 */
export function generateCommitMessage(
  action: 'create' | 'update' | 'delete',
  contentType: 'article' | 'portfolio' | 'partner' | 'testimonial',
  title: string
): string {
  const actionText = action.charAt(0).toUpperCase() + action.slice(1)
  const contentTypeText = contentType.charAt(0).toUpperCase() + contentType.slice(1)
  
  return `${actionText} ${contentTypeText}: ${title}`
}

/**
 * Commit articles.json to GitHub
 */
export async function commitArticles(content: string, action: 'create' | 'update' | 'delete', title: string): Promise<boolean> {
  const message = generateCommitMessage(action, 'article', title)
  return commitToGitHub({
    filePath: 'cradex-agency/public/data/articles.json',
    content,
    message,
  })
}

/**
 * Commit portfolio.json to GitHub
 */
export async function commitPortfolio(content: string, action: 'create' | 'update' | 'delete', title: string): Promise<boolean> {
  const message = generateCommitMessage(action, 'portfolio', title)
  return commitToGitHub({
    filePath: 'cradex-agency/public/data/portfolio.json',
    content,
    message,
  })
}

/**
 * Commit partners.json to GitHub
 */
export async function commitPartners(content: string, action: 'create' | 'update' | 'delete', name: string): Promise<boolean> {
  const message = generateCommitMessage(action, 'partner', name)
  return commitToGitHub({
    filePath: 'cradex-agency/public/data/partners.json',
    content,
    message,
  })
}

/**
 * Commit testimonials.json to GitHub
 */
export async function commitTestimonials(content: string, action: 'create' | 'update' | 'delete', clientName: string): Promise<boolean> {
  const message = generateCommitMessage(action, 'testimonial', clientName)
  return commitToGitHub({
    filePath: 'cradex-agency/public/data/testimonials.json',
    content,
    message,
  })
}
