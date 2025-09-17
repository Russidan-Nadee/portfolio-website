// src/data/projects/translations/ja/calculator.ts

export const calculatorData = {
   navigation: {
      backLink: "/portfolio",
      backText: "ポートフォリオに戻る",
      projectNumber: 1,
      totalProjects: 5,
      prevProjectSlug: "asset-management",
      nextProjectSlug: undefined
   },

   header: {
      title: "高度な電卓アプリ",
      description: "PythonとTkinterで構築された機能豊富な電卓で、使いやすいUIを備えています",
      tags: ["Python", "Tkinter", "Desktop App", "GUI"],
      githubUrl: "https://github.com/Russidan-Nadee/calculator_intern_test",
      demoUrl: "https://github.com/Russidan-Nadee/python-calculator/releases/download/v1.0/Python-Calculator.exe"
   },

   infoBar: {
      duration: "2週間",
      status: "Intern Test Project",
      company: "Self-Development",
      technologies: ["Python", "Tkinter", "Math"],
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
         title: "Pythonで構築された電卓アプリ",
         imageAlt: "電卓アプリのメイン画面",
         about: {
            title: "プロジェクトについて",
            paragraphs: [
               "TkinterでPython GUIプログラミングを学習するために開発された電卓アプリケーションで、美しく使いやすいユーザーインターフェースの作成に重点を置いています。",
               "このプロジェクトは、Pythonプログラミングとデスクトップアプリケーション開発の学習の一部で、基本計算と高度計算の両方をカバーしています。"
            ]
         },
         objectives: {
            title: "目的",
            content: "Pythonでのデスクトップアプリケーション開発を学習 • GUI作成のためのTkinterの練習 • イベントハンドリングとユーザー入力検証の理解"
         }
      },

      features: {
         title: "主要機能",
         items: [
            {
               title: "基本演算",
               description: "基本計算：加算、減算、乗算、除算"
            },
            {
               title: "科学関数",
               description: "sin、cos、tan、logなどの科学関数"
            },
            {
               title: "キーボードサポート",
               description: "キーボード入力のサポート"
            },
            {
               title: "エラーハンドリング",
               description: "計算エラーの処理"
            }
         ]
      },

      gallery: {
         title: "スクリーンショット",
         items: [
            "Main Calculator Interface",
            "Scientific Mode",
            "Memory Functions Panel",
            "Calculation History",
            "Error Display Example"
         ]
      },

      technical: {
         title: "技術詳細",
         details: {
            "Programming Language": "Python 3.8+",
            "GUI Framework": "Tkinter (built-in)",
            "Math Library": "Math, NumPy",
            "Design Pattern": "MVC (Model-View-Controller)"
         },
         challenges: {
            title: "課題",
            items: [
               {
                  title: "UIレスポンシブ性",
                  description: "高速ボタン押下に対するインターフェースのレスポンシブ性"
               },
               {
                  title: "式解析",
                  description: "入力テキストを数学的方程式に変換"
               },
               {
                  title: "エラー防止",
                  description: "ゼロ除算と無効な入力によるエラーの防止"
               },
               {
                  title: "メモリ管理",
                  description: "計算履歴を保存するためのメモリ管理"
               }
            ]
         }
      },

      results: {
         title: "結果",
         items: [
            {
               title: "プロジェクトの成功",
               description: "包括的な機能を持つ機能的な電卓アプリの作成に成功"
            },
            {
               title: "獲得スキル",
               description: "Pythonスキルの向上とTkinterでのGUI開発"
            },
            {
               title: "使用",
               description: "日常計算の個人ツールとして使用"
            },
            {
               title: "コード品質",
               description: "コードは良い構造、明確な分離、ドキュメンテーションを持つ"
            }
         ],
         futureGoals: {
            title: "開発計画",
            items: [
               { description: "高価な電卓のような使いやすさの向上" }
            ]
         }
      }
   }
}