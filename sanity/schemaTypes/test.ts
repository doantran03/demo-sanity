import { defineField, defineType } from 'sanity'

export const testType = defineType({
  name: 'test',
  title: 'Tests',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
            {
              type: 'block'
            },
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text',
                }
              ]
            }
          ]
    }),
    defineField({ 
      name: 'location', 
      title: 'Location',
      type: 'address',
    }),
    defineField({
      name: 'isDead',
      title: 'Is Dead',
      type: 'boolean',
    }),
    defineField({
      name: 'dead_date',
      title: 'Dead Date',
      type: 'datetime',
      hidden: ({ document }) => !document?.isDead,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'author.avatar',
    },
  },
})