import blog from './blog'
import portfolio from './portfolio'
import partner from './partner'
import testimonial from './testimonial'
import chatQuestion from './chatQuestion'
import chatAnswer from './chatAnswer'
import workCase from './workCase'
import { localeString, localeText } from './locale'

export const schemaTypes = [localeString, localeText, blog, portfolio, workCase, partner, testimonial, chatQuestion, chatAnswer]
