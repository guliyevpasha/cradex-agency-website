/**
 * Questions the site assistant could not answer. A new one also arrives by
 * e-mail; write the reply in "Cavab" and the visitor sees it in the chat.
 * Tick "Bilik bazasına əlavə et" to let the assistant reuse it next time.
 * @author Paşa Quliyev — Cradex Agency
 */
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'chatQuestion',
  title: 'Çatbot sualları',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Sual', type: 'text', rows: 3, readOnly: true }),
    defineField({
      name: 'answer',
      title: 'Cavab',
      type: 'text',
      rows: 5,
      description: 'Yazıb "Publish" edin: ziyarətçi cavabı çatda görəcək.',
    }),
    defineField({
      name: 'reuse',
      title: 'Bilik bazasına əlavə et',
      type: 'boolean',
      description: 'Oxşar sual yenə gələndə köməkçi bu cavabı özü versin.',
      initialValue: false,
    }),
    defineField({ name: 'contact', title: 'Ziyarətçinin əlaqəsi', type: 'string', readOnly: true }),
    defineField({ name: 'locale', title: 'Dil', type: 'string', readOnly: true }),
    defineField({ name: 'page', title: 'Səhifə', type: 'string', readOnly: true }),
    defineField({ name: 'createdAt', title: 'Tarix', type: 'datetime', readOnly: true }),
    // Only the server knows this; it links the reply to the visitor's chat.
    defineField({ name: 'session', type: 'string', hidden: true, readOnly: true }),
  ],
  orderings: [{ title: 'Ən yeni', name: 'newest', by: [{ field: 'createdAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'question', answer: 'answer', date: 'createdAt' },
    prepare: ({ title, answer, date }) => ({
      title: title || '—',
      subtitle: `${answer ? '✓ cavablanıb' : '● cavab gözləyir'}${date ? ` · ${new Date(date).toLocaleString('az')}` : ''}`,
    }),
  },
})
