// src/data/projects/translations/ja/asset-dashboard.ts

export const assetDashboardData = {
   navigation: {
      backLink: "/portfolio",
      backText: "ポートフォリオに戻る",
      projectNumber: 2,
      totalProjects: 5,
      prevProjectSlug: "invest-fam",
      nextProjectSlug: "portfolio-website"
   },

   header: {
      title: "TP RFID",
      description: "RFIDテクノロジーを使用した包括的な資産管理システムで、コスト削減と効率向上を実現",
      tags: ["2025", "Cross-platform", "Enterprise", "管理", "多言語", "Light/Dark", "RFID"],
      githubUrl: "https://github.com/Russidan-Nadee/intern-project-rfid"
   },

   infoBar: {
      duration: "6ヶ月",
      status: "開発中",
      company: "Thai Parkerizing",
      technologies: ["Flutter", "Express", "MySQL"],
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
         title: "RFIDテクノロジーを使用した包括的な資産管理システム",
         imageAlt: "RFID資産管理システムのメインインターフェース",
         about: {
            title: "プロジェクトについて",
            paragraphs: [
               "RFIDテクノロジーを使用した資産管理システムで、外部の高価なソフトウェアを購入する会社のコストを削減するため、特定のニーズに合わせた社内ソリューションを開発しました。",
               "このシステムはクロスプラットフォームソリューションとして設計され、モバイルアプリ、ウェブアプリケーション、Windowsデスクトップアプリをサポートしてあらゆるシナリオでの使用を保証します。"
            ]
         },
         objectives: {
            title: "目的",
            content: "部門内に展開してシステムの効率をテストし、改善する • 将来的に、システムが良好に動作すれば、全社に使用を拡大して全体的な資産管理効率を向上させる"
         }
      },

      features: {
         title: "主要機能",
         items: [
            {
               title: "ダッシュボード",
               description: "資産統計とデータをグラフィカル形式で表示するダッシュボード"
            },
            {
               title: "スキャン",
               description: "RFIDタグをスキャンして情報を表示し、資産ステータスを更新"
            },
            {
               title: "検索",
               description: "資産番号、名前、カテゴリ、またはその他の関連情報で資産を検索"
            },
            {
               title: "エクスポート",
               description: "CSVまたはExcelファイルとしてレポートをエクスポート"
            },
            {
               title: "設定",
               description: "システム設定の構成、ユーザー管理とアクセス権限、言語とテーマ"
            },
            {
               title: "同期",
               description: "モバイル、ウェブ、デスクトップアプリ間でデータを同期"
            }
         ]
      },

      gallery: {
         title: "スクリーンショット",
         items: [
            "Dashboard Overview",
            "RFID Scanning Interface",
            "Asset Search & Filter",
            "Asset Details View",
            "Export Reports",
            "Settings Panel"
         ]
      },

      technical: {
         title: "技術詳細",
         details: {
            "Framework": "Flutter, Node.js",
            "Language": "Dart, JavaScript",
            "Database": "MySQL, Prisma ORM",
            "Platform": "Mobile, Web, Desktop, Android, iOS",
            "Authentication": "JWT",
            "Integration": "RFID Reader API",
            "Version Control": "Git, GitHub"
         },
         challenges: {
            title: "課題",
            items: [
               {
                  title: "クロスプラットフォーム互換性",
                  description: "すべてのプラットフォーム（モバイル、ウェブ、デスクトップ）で一貫したシステムパフォーマンスを確保"
               },
               {
                  title: "RFID統合",
                  description: "RFIDリーダーデバイスとの接続とタグデータの処理"
               },
               {
                  title: "リアルタイム同期",
                  description: "複数のデバイス間でのリアルタイムデータ同期"
               },
               {
                  title: "データベースパフォーマンス",
                  description: "大量の資産データを扱う際のデータベースパフォーマンスの最適化"
               },
               {
                  title: "ユーザーエクスペリエンス",
                  description: "すべてのデバイスでユーザーフレンドリーでレスポンシブなUI/UXの設計"
               }
            ]
         }
      },

      results: {
         title: "結果",
         items: [
            {
               title: "開発ステータス",
               description: "プロジェクトは現在開発中（フェーズ1）で、2025年第4四半期に完了予定"
            },
            {
               title: "コスト削減",
               description: "外部ソフトウェア購入コストを約76.21%以上削減すると予想"
            },
            {
               title: "作業効率",
               description: "資産カウント時間を日単位から時間単位に短縮"
            },
            {
               title: "UX/UIフレンドリー",
               description: "便利さと使いやすさについてユーザーから好意的なフィードバックを受領"
            }
         ],
         futureGoals: {
            title: "将来の目標",
            items: [
               { description: "部門でのテスト結果が目標を満たせば、全社に使用を拡大" },
               { description: "高度なセキュリティシステムの実装" },
               { description: "一元管理のための会社ERPシステムとの統合" },
               { description: "資産ステータス変更時の通知システム開発" },
               { description: "資産廃棄システムの追加" }
            ]
         }
      }
   }
}