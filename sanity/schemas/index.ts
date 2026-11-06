import blog from './blog'
import portfolio from './portfolio'
import partner from './partner'
import testimonial from './testimonial'
import chatQuestion from './chatQuestion'
import chatAnswer from './chatAnswer'
import workCase from './workCase'
import comboPackage from './comboPackage'
import comboOrder from './comboOrder'
import { localeString, localeText } from './locale'

export const schemaTypes = [localeString, localeText, blog, portfolio, workCase, comboPackage, comboOrder, partner, testimonial, chatQuestion, chatAnswer]
