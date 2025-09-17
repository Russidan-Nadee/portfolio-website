// src/data/projects/translations/ja/portfolio-website.ts

export const portfolioWebsiteData = {
   navigation: {
      backLink: "/portfolio",
      backText: "ポートフォリオに戻る",
      projectNumber: 3,
      totalProjects: 5,
      prevProjectSlug: "asset-dashboard",
      nextProjectSlug: "asset-management"
   },

   header: {
      title: "個人ポートフォリオウェブサイト",
      description: "Next.jsとTypeScriptで構築された多言語対応の個人ポートフォリオウェブサイトで、ダークモード機能付き",
      tags: ["2025", "ウェブサイト", "個人", "ポートフォリオ", "多言語", "Light/Dark"],
      githubUrl: "https://github.com/Russidan-Nadee/portfolio"
   },

   infoBar: {
      duration: "2ヶ月",
      status: "完成",
      company: "Self-Development",
      technologies: ["Next.js"],
      labels: {
         duration: "開発期間",
         status: "ステータス",
         company: "会社",
         technology: "主要技術"
      }
   },

   tabsContent: {
      tabs: {
         overview: "概要",
         features: "機能",
         gallery: "スクリーンショット",
         technical: "技術詳細",
         results: "結果"
      },

      overview: {
         title: "モダンで使いやすいポートフォリオウェブサイト",
         imageAlt: "ポートフォリオウェブサイトのホームページ",
         about: {
            title: "プロジェクトについて",
            paragraphs: [
               "モダンで効率的な技術を使用して、作品、スキル、および職歴を紹介するために設計された個人ポートフォリオウェブサイト。",
               "システムは3つの言語（タイ語、英語、日本語）をサポートし、ダーク/ライトモードと、すべてのデバイスで良好に動作するレスポンシブデザインを備えています。"
            ]
         },
         objectives: {
            title: "目的",
            content: "プロフェッショナルなオンラインプレゼンスの作成 • 新技術使用能力の実証 • 雇用者やクライアントとの連絡チャネルの提供 • フロントエンド開発スキルの練習"
         }
      },

      features: {
         title: "主要機能",
         items: [
            {
               title: "多言語サポート",
               description: "3つの言語をサポート：タイ語、英語、日本語でリアルタイム言語切り替え"
            },
            {
               title: "ダーク/ライトモード",
               description: "好みに応じてテーマを変更するテーマスイッチャー"
            },
            {
               title: "レスポンシブデザイン",
               description: "モバイル、タブレット、コンピューターで良好に動作するよう設計"
            },
            {
               title: "インタラクティブポートフォリオ",
               description: "フィルター付きのインタラクティブポートフォリオ表示"
            },
            {
               title: "連絡先統合",
               description: "ソーシャルメディアとメールに接続された連絡システム"
            },
            {
               title: "SEO最適化",
               description: "検索エンジン用のSEOとメタタグの最適化"
            }
         ]
      },

      gallery: {
         title: "スクリーンショット",
         items: [
            "Landing Page",
            "About Me Page",
            "Portfolio Showcase",
            "Contact Page",
            "Dark Mode Interface",
            "Mobile Responsive View"
         ]
      },

      technical: {
         title: "技術詳細",
         details: {
            "Framework": "Next.js 14",
            "Language": "TypeScript",
            "Platform": "Web",
            "Styling": "Tailwind CSS",
            "Features": "i18n, Theme switching",
            "Deployment": "Netlify",
            "Version Control": "Git, GitHub"
         },
         challenges: {
            title: "課題",
            items: [
               {
                  title: "多言語実装",
                  description: "多言語データとダイナミックコンテンツローディングの管理"
               },
               {
                  title: "パフォーマンス最適化",
                  description: "高速読み込みとSEOフレンドリーなパフォーマンスの最適化"
               },
               {
                  title: "ユーザーフレンドリーなUI",
                  description: "すべてのユーザーが使いやすくアクセスしやすいウェブサイトの作成"
               },
               {
                  title: "レスポンシブレイアウト",
                  description: "すべての画面サイズに適合する設計"
               }
            ]
         }
      },

      results: {
         title: "結果",
         items: [
            {
               title: "機能的なウェブサイト",
               description: "Vercelにデプロイ済み、使用準備完了で作品を紹介"
            },
            {
               title: "強化されたフロントエンドスキル",
               description: "Next.js、TypeScript、モダンウェブ開発をマスター"
            },
            {
               title: "プロフェッショナルポートフォリオ",
               description: "能力を実証し、良い代表となるウェブサイトを保有"
            },
            {
               title: "パフォーマンススコア",
               description: "SEOとアクセシビリティでLighthouseの高スコアを達成"
            }
         ],
         futureGoals: {
            title: "開発計画",
            items: [
               { description: "目標に達する新しいプロジェクトをポートフォリオに追加" }
            ]
         }
      }
   }
}