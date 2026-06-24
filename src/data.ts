import { Step } from './types';

export const STEPS: Step[] = [
  {
    title: "1단계 — 막막한 시작",
    sub: "무엇부터 물어야 할지 모를 때",
    insight: "가장 좋은 첫 질문은 '어떻게 만드나요?'가 아니라 '내가 원하는 게 뭔지' 설명하는 것. AI가 방향을 잡아준다.",
    msgs: [
      {
        r: "u",
        text: "안녕하세요. 저는 구매팀 대리인데요,\n매일 아침 원유 가격을 인터넷에서 찾아보는 게\n너무 귀찮거든요. 코딩은 전혀 모르는데\n파이썬으로 자동화할 수 있다고 들었어요.\n뭐부터 시작해야 하나요?"
      },
      {
        r: "a",
        text: "반갑습니다! 충분히 만들 수 있어요. 코딩 몰라도 됩니다.\n\n먼저 원하시는 걸 구체적으로 알면 설계를 도와드릴게요.\n\n몇 가지만 여쭤볼게요:\n- 어떤 원자재 가격을 보고 싶으세요?\n- 결과를 어디서 받고 싶으세요? (이메일? 화면 출력?)\n- 얼마나 자주 확인하고 싶으세요?",
        tags: [
          { bg: "#e6f1fb", tx: "#0c447c", bd: "#b5d4f4", lb: "설계 질문 먼저" }
        ],
        tip: "AI가 바로 코드를 쓰지 않고 무엇을 만들지 먼저 묻는 것이 좋은 설계의 시작입니다."
      }
    ]
  },
  {
    title: "2단계 — 요구사항 정의",
    sub: "원하는 것을 구체적으로 말하기",
    insight: "'그냥 만들어줘'보다 '언제·무엇을·어디로' 세 가지를 말하면 AI가 훨씬 정확한 코드를 만든다. 이게 요구사항 정의다.",
    msgs: [
      {
        r: "u",
        text: "WTI 원유랑 나프타 가격을 보고 싶고요,\n매일 아침 9시에 이메일로 받고 싶어요.\n전날 대비 3% 이상 변동되면 강조 표시해줬으면 해요."
      },
      {
        r: "a",
        text: "완벽해요. 요구사항을 정리해 드릴게요:\n\n  수집 대상: WTI 원유 (CL=F), 나프타\n  발송 시각: 매일 09:00 자동 실행\n  알림 조건: 전일 대비 +-3% 초과 시 강조\n  형식: HTML 이메일 (색상 강조 포함)\n\n이 내용이 맞으면 파일 구조를 설계하고\n하나씩 만들어 나가겠습니다.",
        tags: [
          { bg: "#eaf3de", tx: "#27500a", bd: "#c0dd97", lb: "요구사항 확인" },
          { bg: "#e6f1fb", tx: "#0c447c", bd: "#b5d4f4", lb: "단계별 진행 예고" }
        ]
      }
    ]
  },
  {
    title: "3단계 — 첫 번째 코드",
    sub: "가장 작은 것부터 하나씩",
    insight: "처음부터 완성본을 요청하지 말고, 가장 작은 기능 하나만 먼저 만들어 작동을 확인하는 것이 핵심이다.",
    msgs: [
      {
        r: "u",
        text: "그럼 일단 원유 가격만 먼저 터미널에\n출력하는 것부터 만들어볼 수 있을까요?\n이메일은 나중에요."
      },
      {
        r: "a",
        text: "좋은 접근입니다! 딱 그렇게 해야 해요.\n\n먼저 설치:\n<pre>pip install yfinance</pre>\nprice_test.py 를 만들어드릴게요:\n<pre>import yfinance as yf\nfrom datetime import datetime\n\nticker  = yf.Ticker('CL=F')\ninfo    = ticker.fast_info\ncurrent = info.last_price\nprev    = info.regular_market_previous_close\nchange  = (current - prev) / prev * 100\n\nprint(f'[{datetime.now():%Y-%m-%d %H:%M}]')\nprint(f'WTI 원유: ${current:.2f}')\nprint(f'변동:     {change:+.2f}%')\nif abs(change) >= 3:\n    print(\"경고: 3% 이상 변동!\")</pre>\n실행: <code>python price_test.py</code>",
        tip: "5줄로 원유 가격이 출력됩니다. 먼저 이게 돌아가는지 확인해보세요."
      }
    ]
  },
  {
    title: "4단계 — 오류 만났을 때",
    sub: "막혔을 때 AI에게 물어보는 법",
    insight: "오류 메시지를 그대로 복사해서 붙여넣는 것이 가장 빠른 해결 방법. 무슨 말인지 몰라도 된다. AI가 해석해준다.",
    msgs: [
      {
        r: "u",
        text: "실행했더니 이런 오류가 나왔어요:\n\nAttributeError: 'FastInfo' object has\nno attribute 'previous_close'\n\n뭔가요 이게..."
      },
      {
        r: "a",
        text: "걱정 마세요, 흔한 오류예요.\nyfinance 버전에 따라 속성 이름이 다를 수 있어요.\n\nprevious_close 대신 이렇게 바꿔보세요:\n<pre>prev = info.regular_market_previous_close</pre>\n그래도 안 되면 이 방식으로 대체하세요:\n<pre>hist = ticker.history(period='2d')\nprev = hist['Close'].iloc[-2]</pre>",
        tags: [
          { bg: "#faeeda", tx: "#633806", bd: "#fac775", lb: "오류 해석" },
          { bg: "#eaf3de", tx: "#27500a", bd: "#c0dd97", lb: "두 가지 해결책" }
        ],
        tip: "오류를 AI에게 그대로 붙여넣으면 대부분 바로 해결됩니다. 이게 AI 활용의 핵심 스킬이에요."
      }
    ]
  },
  {
    title: "5단계 — 이메일 기능 추가",
    sub: "작동 확인 후 다음 단계로",
    insight: "작동 확인 후 기능을 하나씩 추가하는 방식이 가장 안전하다. 한 번에 전부 바꾸면 오류 위치를 찾기 어렵다.",
    msgs: [
      {
        r: "u",
        text: "됐어요! 터미널에 가격이 잘 나와요.\n이제 Gmail로 이메일 보내는 기능을 추가하고 싶어요."
      },
      {
        r: "a",
        text: "완벽해요. mailer.py 를 따로 만들게요.\n\nGmail 앱 비밀번호 먼저 만드세요:\n  Google 계정 → 보안 → 앱 비밀번호 (16자리)\n\n<pre>import smtplib\nfrom email.mime.multipart import MIMEMultipart\nfrom email.mime.text import MIMEText\n\ndef send_report(subject, html_body):\n    msg = MIMEMultipart('alternative')\n    msg['Subject'] = subject\n    msg['From']    = 'your@gmail.com'\n    msg['To']      = 'boss@company.com'\n    msg.attach(MIMEText(html_body, 'html'))\n    with smtplib.SMTP('smtp.gmail.com', 587) as s:\n        s.starttls()\n        s.login('your@gmail.com', '앱비밀번호16자리')\n        s.sendmail(msg['From'], [msg['To']], msg.as_string())\n    print('발송 완료!')</pre>",
        tip: "이메일 비밀번호는 절대 코드에 직접 쓰지 마세요. 앱 비밀번호를 별도로 만들어야 합니다."
      }
    ]
  },
  {
    title: "6단계 — 자동화 완성",
    sub: "모든 모듈을 조립하고 자동 실행",
    insight: "완성 후 '이것도 되면 좋겠다'는 생각이 생기면 그게 다음 프로그램의 씨앗이다. 첫 완성이 가장 중요하다.",
    msgs: [
      {
        r: "u",
        text: "이메일도 잘 왔어요!\n이제 매일 9시에 자동 실행되게 하려면 어떻게 해요?\n나프타 가격도 같이 넣고 싶고요."
      },
      {
        r: "a",
        text: "거의 다 왔어요! 마지막 조립입니다.\n\nmonitor.py — 모든 걸 연결하는 메인 파일:\n<pre>import schedule, time\nfrom price_test import get_prices\nfrom mailer import send_report\n\ndef daily_job():\n    data = get_prices(['CL=F', 'BZ=F'])\n    html = build_html_table(data)\n    send_report('원자재 일일 보고', html)\n    print('완료!')\n\nschedule.every().day.at('09:00').do(daily_job)\n\nprint('모니터링 시작... (Ctrl+C로 종료)')\nwhile True:\n    schedule.run_pending()\n    time.sleep(60)</pre>\n설치: <code>pip install schedule</code>\n\npython monitor.py 실행 후 PC를 켜두기만 하면\n매일 9시에 이메일이 자동으로 옵니다.",
        tags: [
          { bg: "#eaf3de", tx: "#27500a", bd: "#c0dd97", lb: "완성" },
          { bg: "#e6f1fb", tx: "#0c447c", bd: "#b5d4f4", lb: "다음엔 납기 알림도 가능" }
        ],
        tip: "이 패턴을 이해하면 납기 알림, 재고 경고도 같은 방식으로 만들 수 있습니다."
      }
    ]
  }
];
