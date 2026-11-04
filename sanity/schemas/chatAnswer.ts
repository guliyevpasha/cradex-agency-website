/**
 * Ready answers for the site assistant (on top of the FAQs already on the
 * site). Add a question as visitors would write it, a few keywords and the
 * answer; leave "Dil" empty to use it in every language.
 * @author Paşa Quliyev — Cradex Agency
 */
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'chatAnswer',
  title: 'Çatbot cavabları',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Sual', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'keywords',
      title: 'Açar sözlər',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Məsələn: qiymət, neçəyə, endirim',
    }),
    defineField({ name: 'answer', title: 'Cavab', type: 'text', rows: 5, validation: (r) => r.required() }),
    defineField({
      name: 'locale',
      title: 'Dil',
      type: 'string',
      options: { list: ['az', 'en', 'ru', 'tr'] },
      description: 'Boş qalsa, bütün dillərdə istifadə olunur.',
    }),
  ],
  preview: { select: { title: 'question', subtitle: 'answer' } },
})
