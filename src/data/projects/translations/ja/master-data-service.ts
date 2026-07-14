// src/data/projects/translations/ja/master-data-service.ts

export const masterDataServiceData = {
   navigation: {
      backLink: "/portfolio",
      backText: "ポートフォリオに戻る",
      projectNumber: 8,
      totalProjects: 8,
      prevProjectSlug: undefined,
      nextProjectSlug: "money-tracker-app"
   },

   header: {
      title: "Master Data Service",
      description: "FastShipプラットフォーム向けに、複数の中核データドメインを単一のAPIに集約したバックエンドマイクロサービス",
      tags: ["2026", "Backend", "Microservice", "API", "Enterprise"],
      githubUrl: undefined
   },

   infoBar: {
      duration: "2ヶ月（継続中）",
      status: "運用中",
      company: "FastShip",
      technologies: ["Bun", "ElysiaJS", "MySQL"],
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
         title: "プラットフォームの中核データのためのバックエンドマイクロサービス",
         imageAlt: "Master Data ServiceのSwagger APIドキュメント画面",
         about: {
            title: "プロジェクトについて",
            paragraphs: [
               "Master Data ServiceはFastShipプラットフォーム向けのバックエンドマイクロサービスで、BunとElysiaJSで構築されています。これまでレガシーなモノリスに散在していた複数のデータドメインとロジックを単一の認証付きAPIに集約し、他チームからの利用や保守をしやすくしています。",
               "システムはビジネスドメインごとに独立したモジュールに分かれており、それぞれがcontroller/service/schema層を持ち、Drizzle ORM経由でMySQLデータベースに接続します。認証は会社の共通認証基盤と連携したJWTベースの方式を採用しています。"
            ]
         },
         objectives: {
            title: "目的",
            content: "レガシーモノリスに散在していたロジックを、保守しやすいマイクロサービスとして切り出す • 中核データを他チームも利用できる中央APIとして提供する • 将来新しいドメインを追加しやすいモジュールベースのアーキテクチャを構築する"
         }
      },

      features: {
         title: "主要機能",
         items: [
            {
               title: "マスターデータ管理",
               description: "プラットフォームの中核となる参照データを完全なCRUDで管理。今後新しいデータ種別を追加しやすい設計"
            },
            {
               title: "地名・郵便番号検索",
               description: "国・州/県・都市・郵便番号を検索。タイの郵便番号専用検索にも対応"
            },
            {
               title: "外部API連携",
               description: "GeoNames APIやZohoなどの外部サービスと連携し、位置情報や関連データを取得"
            },
            {
               title: "JWTベース認証",
               description: "会社の共通認証基盤と連携したJWTトークンでAPIへのアクセスを検証"
            }
         ]
      },

      gallery: {
         title: "スクリーンショット",
         items: [
            "Swagger API Documentation",
            "Health Check Endpoint",
            "Master Data CRUD Response"
         ]
      },

      technical: {
         title: "技術詳細",
         details: {
            "Runtime": "Bun 1.3",
            "Framework": "ElysiaJS v1.4",
            "Language": "TypeScript",
            "Database": "MySQL（Drizzle ORM経由）",
            "Authentication": "JWTベース認証",
            "API Docs": "Swagger UI（自動生成）",
            "Code Quality": "ESLint, Prettier, Husky pre-commit hooks"
         },
         challenges: {
            title: "課題",
            items: [
               {
                  title: "移行時の正確性の担保",
                  description: "新サービスの計算結果をレガシーシステムと完全に一致させる必要があったため、カットオーバー前に両システムの結果を検証する比較・ベンチマークスクリプトを作成した"
               },
               {
                  title: "[追記予定]",
                  description: "このプロジェクトの他の課題は後日追記します"
               }
            ]
         }
      },

      results: {
         title: "結果",
         items: [
            {
               title: "複数のドメインを1つのマイクロサービスに統合",
               description: "レガシーモノリスに散在していたロジックを切り出し、独立してデプロイ可能なサービスに移行"
            },
            {
               title: "[追記予定]",
               description: "このプロジェクトの結果は後日追記します"
            }
         ],
         futureGoals: {
            title: "将来の目標",
            items: [
               { description: "確立したモジュールベースのアーキテクチャに沿って新しいモジュールを追加" },
               { description: "[追記予定] 将来の目標は後日追記します" }
            ]
         }
      }
   }
}
