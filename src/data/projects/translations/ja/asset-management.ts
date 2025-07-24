// src/data/projects/translations/ja/asset-management.ts

export const assetManagementData = {
   navigation: {
      backLink: "/portfolio",
      backText: "ポートフォリオに戻る",
      projectNumber: 3,
      totalProjects: 4,
      prevProjectSlug: "portfolio-website",
      nextProjectSlug: "calculator"
   },

   header: {
      title: "資産管理モバイルアプリ",
      description: "資産管理用のモバイルアプリケーション",
      tags: ["Mobile App", "Flutter", "Node.js", "Express", "MySQL"],
      githubUrl: "https://github.com/Russidan-Nadee/learn-flutter-express"
   },

   infoBar: {
      duration: "3ヶ月",
      status: "Training Project",
      company: "Self-Development",
      technologies: ["Flutter", "Node.js", "Express", "MySQL"],
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
         title: "企業資産管理用モバイルアプリケーション",
         imageAlt: "資産管理モバイルアプリのメイン画面",
         about: {
            title: "プロジェクトについて",
            paragraphs: [
               "組織の資産管理でスタッフを支援するためにFlutterで開発されたモバイルアプリケーションで、フィールド操作の利便性とリアルタイムデータアクセスに重点を置いています。",
               "このアプリは、より大きな資産管理システムの一部で、同じ中央データベースに接続されたモバイルインターフェースとして機能します。"
            ]
         },
         objectives: {
            title: "目的",
            content: "包括的なモバイルアプリケーション開発の練習 • データチェックと記録の時間短縮 • スタッフ向けの良いモバイルエクスペリエンスの創出"
         }
      },

      features: {
         title: "主要機能",
         items: [
            {
               title: "資産登録",
               description: "完全な情報入力で新しい資産を登録"
            },
            {
               title: "ログインと認証",
               description: "ユーザー向けのセキュアなログインシステム"
            },
            {
               title: "リアルタイム更新",
               description: "資産ステータスの更新とサーバーとのリアルタイム同期"
            },
            {
               title: "レポート生成",
               description: "レポートを生成し、さまざまな形式でデータをエクスポート"
            },
            {
               title: "ユーザー管理",
               description: "ユーザー管理システムとアクセス権限"
            }
         ]
      },

      gallery: {
         title: "スクリーンショット",
         items: [
            "Login & Dashboard Screen",
            "Asset Details View",
            "Asset Registration Form",
            "Camera & Photo Capture",
            "Reports & Analytics"
         ]
      },

      technical: {
         title: "技術詳細",
         details: {
            "Mobile Framework": "Flutter 3.x",
            "Programming Language": "Dart",
            "Backend API": "Node.js + Express",
            "Storage": "MySQL",
            "HTTP Client": "dio",
            "Authentication": "JWT Token"
         },
         challenges: {
            title: "課題",
            items: [
               {
                  title: "認証フロー",
                  description: "セキュアなログインシステムとID検証の管理"
               },
               {
                  title: "データ同期",
                  description: "モバイルアプリとバックエンドサーバー間のリアルタイムデータ同期"
               },
               {
                  title: "UI/UXデザイン",
                  description: "モバイルデバイス用のユーザーフレンドリーでレスポンシブなUIの設計"
               },
               {
                  title: "パフォーマンス最適化",
                  description: "高速でスムーズな動作のためのアプリパフォーマンスの最適化"
               },
               {
                  title: "クロスプラットフォーム互換性",
                  description: "iOSとAndroidの両方で良好に動作するアプリの作成"
               }
            ]
         }
      },

      results: {
         title: "結果",
         items: [
            {
               title: "作業速度",
               description: "資産チェック時間を項目あたり5-10分から1-2分に短縮"
            },
            {
               title: "データ精度",
               description: "手動データ入力エラーを削減"
            },
            {
               title: "ユーザーエクスペリエンス",
               description: "便利さと使いやすさについてユーザーから好意的なフィードバックを受領"
            },
            {
               title: "Flutterでのモバイルアプリ開発の学習",
               description: "Flutterでのアプリケーション開発を学習"
            },
            {
               title: "Node.jsとExpressでのバックエンド開発の学習",
               description: "MySQLデータベースに接続されたバックエンドAPI開発を学習"
            },
            {
               title: "JWTを使用した認証システムの学習",
               description: "JWTトークンを使用したログインシステムとID検証を学習"
            }
         ],
         futureGoals: {
            title: "開発計画",
            items: [
               { description: "重要なアラート用のプッシュ通知を追加" },
               { description: "QRコードスキャン用のQRコードスキャナー" },
               { description: "バーコードスキャン用のバーコードスキャナー" },
               { description: "モバイル最適化されたダッシュボード分析" }
            ]
         }
      }
   }
}