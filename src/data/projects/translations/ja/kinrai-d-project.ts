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
      githubUrl: undefined,
      demoUrl: undefined,
      liveUrl: undefined,
   },
   infoBar: {
      duration: '4ヶ月',
      status: '開発中',
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
         imageAlt: '',
         about: {
            title: 'プロジェクトについて',
            paragraphs: [
               'Kinrai-Dは、ユーザーが楽しく魅力的な方法で料理を発見し選択できるよう設計された食品ランダマイザーアプリケーションです。食事選択時の決断疲れを軽減するスマートなランダム化システムを使用しています。',
               'このアプリケーションはクロスプラットフォーム対応のためFlutterで構築され、信頼性のあるデータ管理のためSupabaseを通じてPostgreSQLデータベースとNest.jsをバックエンドとして使用しています。',
            ],
         },
         objectives: {
            title: '目的',
            content: 'ユーザーが便利で楽しく新しい食べ物の選択肢を発見できるアプリケーションを作成し、意思決定時間を短縮し、多様な料理を試す体験を向上させる。',
         },
      },
      features: {
         title: '主な機能',
         items: [
            {
               title: '食品ランダム化システム',
               description: 'タイプと好みに基づくフィルターで、多様なデータベースから食品をランダムに選択',
            },
            {
               title: 'お気に入り管理',
               description: 'お気に入りの食品アイテムを保存・管理し、簡単にアクセスして今後の参考に',
            },
            {
               title: '評価・レビューシステム',
               description: '試した食品アイテムを評価・レビューして、他のユーザーの情報に基づいた選択をサポート',
            },
            {
               title: '高度な検索',
               description: 'カテゴリ、材料、価格帯、辛さレベルで食品を検索',
            },
            {
               title: 'オフラインモード',
               description: 'インターネット接続なしでアプリを使用し、再接続時にデータ同期',
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
                  title: 'スマートランダム化アルゴリズム',
                  description: 'ユーザーの好みと選択履歴を考慮したランダム化システムの開発',
               },
               {
                  title: 'オフラインデータ管理',
                  description: 'オンラインとオフラインの両方で動作するデータ同期システムの設計',
               },
               {
                  title: 'クロスプラットフォーム UI/UX',
                  description: 'すべてのプラットフォームで一貫したユーザー体験の作成',
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
               title: '効率的なバックエンドシステム',
               description: 'Nest.jsとSupabaseを使用した高速で安全なAPIを構築',
            },
            {
               title: '魅力的なユーザー体験',
               description: '食品選択を楽しく簡単にするUI/UXを設計',
            },
         ],
         futureGoals: {
            title: '将来の目標',
            items: [
               {
                  description: 'AIと機械学習を活用した食品推奨機能の追加',
               },
               {
                  description: '友達とのレビューや推奨の共有のためのソーシャル機能の開発',
               },
               {
                  description: '多言語サポートと国際料理オプションの追加',
               },
               {
                  description: 'レストラン予約と食品注文機能の統合',
               },
            ],
         },
      },
   },
}