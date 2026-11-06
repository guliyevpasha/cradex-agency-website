/**
 * Our work: support. Layout and data in components/work/WorkCategoryPage.
 * @author Paşa Quliyev — Cradex Agency
 */
import { workPage } from '@/components/work/WorkCategoryPage'

// Hourly, like the home page: Studio publishes also refresh via /api/revalidate.
export const revalidate = 3600

const { Page, generateMetadata } = workPage('support')

export { generateMetadata }
export default Page
