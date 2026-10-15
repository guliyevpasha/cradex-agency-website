import { definePlugin } from 'sanity'
import { BarChartIcon } from '@sanity/icons'
import { AnalyticsDashboard } from '../../components/studio/AnalyticsDashboard'

export const analyticsPlugin = definePlugin({
  name: 'analytics-dashboard',
  tools: [
    {
      name: 'analytics',
      title: 'Analytics',
      icon: BarChartIcon,
      component: AnalyticsDashboard,
    },
  ],
})
