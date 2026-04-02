import { defineField, defineType } from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Authors',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required().error('Full Name is required'),
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      validation: (Rule) => Rule.required().error('Biography is required'),
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
    }),
  ],

  preview: {
    select: {
      title: 'fullName',
      subtitle: 'bio',
      media: 'avatar',
    },
  },
})