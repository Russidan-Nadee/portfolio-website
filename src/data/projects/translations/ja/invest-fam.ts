// src/data/projects/translations/ja/invest-fam.ts

import { ProjectData } from '../../types'

export const investFamData: ProjectData = {
   navigation: {
      backLink: '/portfolio',
      backText: 'ポートフォリオに戻る',
      projectNumber: 1,
      totalProjects: 5,
      prevProjectSlug: undefined,
      nextProjectSlug: 'tp-rfid',
   },
   header: {
      title: 'InvestFam',
      description: 'ファミリー投資ウェブサイト - 開発中の新しいプロジェクト',
      tags: ['2025', 'ウェブサイト', '個人', 'ツール', '多言語', 'Light/Dark'],
      githubUrl: undefined,
      demoUrl: undefined,
      liveUrl: 'https://investfam.netlify.app',
   },
   infoBar: {
      duration: '1ヶ月',
      status: '新規プロジェクト',
      company: '個人プロジェクト',
      technologies: ['Next.js'],
      labels: {
         duration: '期間',
         status: 'ステータス',
         company: '会社',
         technology: 'テクノロジー',
      },
   },
   tabsContent: {
      tabs: {
         overview: '概要',
         features: '機能',
         gallery: 'ギャラリー',
         technical: '技術的詳細',
         results: '結果',
      },
      overview: {
         title: 'プロジェクト概要',
         imageAlt: 'InvestFam ウェブサイトプレビュー',
         about: {
            title: 'プロジェクトについて',
            paragraphs: [
               'InvestFamは家族の投資管理のために開発中のウェブサイトです',
               'このプロジェクトはまだ初期段階で、機能を計画中です',
            ],
         },
         objectives: {
            title: '目的',
            content: '家族が効率的に投資を管理・追跡できるプラットフォームを作成する',
         },
      },
      features: {
         title: '主な機能',
         items: [
            {
               title: '投資ポートフォリオの追跡',
               description: '家族の投資ポートフォリオの追跡と管理',
            },
            {
               title: '収益分析',
               description: '投資収益の分析とレポート',
            },
            {
               title: '財務計画',
               description: '家族の財務計画を支援するツール',
            },
         ],
      },
      gallery: {
         title: 'ギャラリー',
         items: [
            'ウェブサイトはまだ開発中です。画像は近日公開予定',
         ],
      },
      technical: {
         title: '技術的詳細',
         details: {
            'Framework': 'Next.js 14',
            'Language': 'TypeScript',
            'Platform': 'Web',
            'Styling': 'Tailwind CSS',
            'Features': 'PWA, i18n',
            'Deployment': 'Netlify, Cloudflare',
            'Version Control': 'Git, GitHub',
         },
         challenges: {
            title: '課題',
            items: [
               {
                  title: 'UX/UIデザイン',
                  description: '家族での利用に適したデザイン',
               },
               {
                  title: 'データセキュリティ',
                  description: '金融データのセキュリティ確保',
               },
            ],
         },
      },
      results: {
         title: '結果',
         items: [
            {
               title: '初期プロジェクト',
               description: 'プロジェクトを開始したばかりで、現在計画と設計段階です',
            },
         ],
         futureGoals: {
            title: '将来の目標',
            items: [
               {
                  description: '投資ポートフォリオ追跡機能の開発',
               },
               {
                  description: '金融データ分析の追加',
               },
               {
                  description: '各種銀行との接続用API作成',
               },
            ],
         },
      },
   },
}