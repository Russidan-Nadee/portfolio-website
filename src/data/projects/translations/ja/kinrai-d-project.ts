// src/data/projects/translations/ja/kinrai-d-project.ts

import { ProjectData } from '../../types'

export const kinraiDData: ProjectData = {
   navigation: {
      backLink: '/portfolio',
      backText: 'ポートフォリオに戻る',
      projectNumber: 0, // Will be calculated dynamically
      totalProjects: 0, // Will be calculated dynamically
      prevProjectSlug: undefined, // Will be calculated dynamically
      nextProjectSlug: undefined, // Will be calculated dynamically
   },
   header: {
      title: 'Kinrai-D',
      description: 'ユーザーが楽しく新しい料理を発見できるクロスプラットフォーム食品ランダマイザーアプリ',
      tags: ['2025', 'アプリ', 'クロスプラットフォーム', '食品', 'ランダム'],
      githubUrl: "https://github.com/Russidan-Nadee/Kinrai-D",
      demoUrl: undefined,
      liveUrl: "https://kinrai-d.vercel.app/",
   },
   infoBar: {
      duration: '4ヶ月',
      status: '完了',
      company: '個人プロジェクト',
      technologies: ['Flutter', 'Nest.js', 'PostgreSQL', 'Supabase'],
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
         technical: '技術',
         results: '結果',
      },
      overview: {
         title: 'プロジェクト概要',
         imageAlt: 'Kinrai-Dアプリの概要スクリーンショット',
         about: {
            title: 'プロジェクトについて',
            paragraphs: [
               'Kinrai-Dは「今日何食べる？」という日常の悩みを解決するための食品ランダマイザーアプリです。ゲストログインで登録不要ですぐに使い始められます。',
               'FlutterによるクロスプラットフォームとNest.js・Supabaseによるバックエンドで構築。フィルター機能・Dislikeシステム・Admin Menu・多言語対応を備えています。',
            ],
         },
         objectives: {
            title: '目的',
            content: 'ランダム化・フィルター・Dislikeシステムを通じてユーザーが食事の決断を簡単に行えるアプリを作成し、Admin Panelによるメニュー管理と多言語対応でグローバルな利用を可能にする。',
         },
      },
      features: {
         title: '主な機能',
         items: [
            {
               title: 'ゲストログイン',
               description: '登録不要でアプリにすぐアクセス可能、匿名ユーザーセッションをサポート',
            },
            {
               title: '食品ランダム化',
               description: 'ワンタップでデータベースからランダムに食事を選択、毎日の食事の悩みを解消',
            },
            {
               title: 'Dislikeシステム',
               description: 'Dislikeをタップして不要な料理をスキップし、すぐに新しいランダム提案を表示',
            },
            {
               title: 'フィルター機能',
               description: 'ユーザーが選択したカテゴリや好みでフィルタリングし、より関連性の高い提案を表示',
            },
            {
               title: 'Admin Menu',
               description: 'データベースの食品アイテムを追加・削除・編集できるAdmin管理画面',
            },
            {
               title: '多言語対応',
               description: '組み込みi18nシステムで複数言語をサポート、世界中のユーザーが利用可能',
            },
         ],
      },
      gallery: {
         title: 'ギャラリー',
         items: [
            'Kinrai-D アプリメイン画面',
            '食品ランダム化システムと結果',
            'お気に入り管理ページ',
            'レビューと評価システム',
            '食品検索とフィルタリング',
         ],
      },
      technical: {
         title: '技術詳細',
         details: {
            'Framework': 'Flutter, Nest.js',
            'Language': 'Dart, TypeScript',
            'Platform': 'クロスプラットフォーム (iOS, Android, Web)',
            'Database': 'PostgreSQL, Prisma ORM',
            'Cloud Service': 'Supabase',
            'Version Control': 'Git, GitHub',
         },
         challenges: {
            title: '課題',
            items: [
               {
                  title: 'ゲストログインシステム',
                  description: '登録ユーザーとゲストの両方をデータ競合なくサポートする認証設計',
               },
               {
                  title: 'フィルター＆Dislike ロジック',
                  description: 'Dislike除外システムと組み合わせた正確でパフォーマンスの高いフィルタリングの構築',
               },
               {
                  title: 'クロスプラットフォーム多言語対応',
                  description: 'iOS・Android・Webプラットフォーム全体で一貫したi18n動作の確保',
               },
            ],
         },
      },
      results: {
         title: '結果',
         items: [
            {
               title: 'クロスプラットフォームアプリケーション',
               description: 'iOS、Android、Webプラットフォームでスムーズに動作するアプリケーションを開発',
            },
            {
               title: 'ランダム化・Dislike・フィルター',
               description: 'ランダム化・Dislike・フィルターが連携して、ユーザーが本当に食べたい料理を提示',
            },
            {
               title: 'Admin ダッシュボード',
               description: '食品データベースを簡単に管理できるAdminパネルを構築',
            },
            {
               title: '多言語サポート',
               description: '完全なi18nサポートにより、さまざまな国のユーザーが快適に利用可能',
            },
         ],
         futureGoals: {
            title: '将来の目標',
            items: [
               {
                  description: 'DislikeデータとフィルターをもとにしたAI食品推奨機能の追加',
               },
               {
                  description: 'ランダム化履歴追跡機能を持つフルユーザーアカウントシステムの開発',
               },
               {
                  description: '国際料理を含む食品データベースの拡充',
               },
               {
                  description: '使用統計とレポートを備えたAdmin Dashboardの強化',
               },
            ],
         },
      },
   },
}