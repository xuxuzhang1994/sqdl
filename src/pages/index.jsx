import React, { useEffect, useState } from 'react';
import styles from './index.less';
import request from '../../request';
// import Swiper from 'swiper';
// import 'swiper/swiper.less';
import { history } from 'umi';

let formData = {};
let swiper;

export default () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOtherLoginErrorModal, setShowOtherLoginErrorModal] = useState(
    false,
  );
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showYuyueSuccessModal, setShowYuyueSuccessModal] = useState(false);
  const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [swiperIndex, setSwiperIndex] = useState(0);
  const [indexData, setIndexData] = useState({});
  const [radioStatus, setRadioStatus] = useState(false);
  let [time, setTime] = useState(0);
  const [uid, setUid] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [errText, setErrText] = useState('登錄失敗o(╥﹏╥)o，請再試一次~');

  useEffect(() => {
    swiper = new Swiper('.swiper-container', {
      direction: 'vertical',
      slidesPerView: 'auto',
      spaceBetween: 0,
      mousewheel: true,
      allowTouchMove: false,
      on: {
        transitionEnd: function() {
          setSwiperIndex(this.activeIndex);
        },
      },
    });
    var swiper2 = new Swiper('.swiper-container2', {
      // effect: 'coverflow',
      // freeMode: true,
      watchSlidesProgress: true,
      slidesPerView: 'auto',
      centeredSlides: true,
      loop: true,
      loopedSlides: 3,
      // autoplay: true,
      navigation: {
        nextEl: '.swiper-button-next2',
        prevEl: '.swiper-button-prev2',
      },
      // coverflowEffect: {
      //     rotate: 40,
      //     stretch: -50,
      //     depth: 300,
      //     modifier: 2,
      //     slideShadows: true,
      // },
      flipEffect: {
        slideShadows: true,
        limitRotation: true,
      },
      pagination: {
        el: '.swiper-pagination',
      },
      on: {
        progress: function(progress) {
          for (let i = 0; i < this.slides.length; i++) {
            var slide = this.slides.eq(i);
            var slideProgress = this.slides[i].progress;
            var modify = 1;
            if (Math.abs(slideProgress) > 1) {
              modify = (Math.abs(slideProgress) - 1) * 0.3 + 1;
            }
            let translate = slideProgress * modify * 440 + 'px';
            let scale = 1 - Math.abs(slideProgress) / 5;
            let zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
            slide.transform(
              'translateX(' + translate + ') scale(' + scale + ')',
            );
            slide.css('zIndex', zIndex);
            slide.css('opacity', 1);
            if (Math.abs(slideProgress) > 3) {
              slide.css('opacity', 0);
            }
          }
        },
        setTransition: function(transition) {
          for (var i = 0; i < this.slides.length; i++) {
            var slide = this.slides.eq(i);
            slide.transition(transition);
          }
        },
      },
    });
    getIndexData();
    const id = history.location.query.uid;
    const share_id = history.location.query.share_id;
    if (share_id) {
      localStorage.setItem('share_id', share_id);
    }
    // formData.share_id = share_id
    setUid(id);
  }, []);

  useEffect(() => {
    let timerId = null;
    const time2 = time;
    const run = () => {
      if (time2 <= 0) {
        return () => {
          timerId && clearTimeout(timerId);
        };
      }
      setTime(time2 - 1);
      timerId = setTimeout(run, 1000);
    };
    timerId = setTimeout(run, 1000);
    return () => {
      timerId && clearTimeout(timerId);
    };
  }, [time]);

  useEffect(() => {
    if (uid) {
      getUserInfo(uid);
    }
  }, [uid]);

  const getIndexData = () => {
    request('/api/homeIndex').then(data => {
      setIndexData(data.data);
      console.log(data.data);
    });
  };

  const sendCode = () => {
    if (!formData.phone) {
      setErrText('請填寫手機號！');
      setShowLoginErrorModal(true);
      return;
    }
    if (!radioStatus) {
      setErrText('請先閱讀並同意用戶條款和隱私協議~');
      setShowLoginErrorModal(true);
      return;
    }
    if (time > 0) {
      return;
    }
    setTime(60);
    // reduceTime()
    request
      .post('/api/sendCode', {
        data: {
          mobile: formData.phone,
        },
      })
      .then(data => {});
  };

  const changeInput = (val, key) => {
    formData[key] = val;
  };

  const changeSource = e => {
    formData.source = e.target.value;
  };

  const login = () => {
    if (!formData.phone) {
      setErrText('請填寫手機號！');
      setShowLoginErrorModal(true);
      return;
    }
    if (!formData.phone) {
      setErrText('請填寫驗證碼！');
      setShowLoginErrorModal(true);
      return;
    }
    if (!radioStatus) {
      setErrText('請先閱讀並同意用戶條款和隱私協議~');
      setShowLoginErrorModal(true);
      return;
    }
    request
      .post('/api/reg', {
        data: {
          // uid: formData.share_id,
          mobile: formData.phone,
          code: formData.code,
          source: 1,
          uid: localStorage.getItem('share_id'),
        },
      })
      .then(data => {
        if (data.code == 0) {
          showYuyueSuccessModal(true);
        } else {
          alert(data.msg);
        }
      });
  };

  const getUserInfo = uid => {
    request('/api/getUserInfo?uid=' + uid).then(data => {
      if (data.code == 0) {
        setUserInfo(data.data);
      }
    });
  };

  const copyText = () => {
    copyToClipboard(userInfo.share_url);
    setShowCopyModal(false);
    setShowCopySuccess(true);
  };

  return (
    <div className={styles.app}>
      {swiperIndex == 0 ? (
        <div className={styles.topbar}>
          <a target="_blank" href="https://www.facebook.com/TheThroneOfGirlTW/">
            <img
              className={styles.youtube}
              src={require('../images/kv/fb.png')}
              alt=""
            />
          </a>
          <a
            target="_blank"
            href="https://www.youtube.com/channel/UC5j2wZ7N6xJ0cUv4O6gKf3Q"
          >
            <img
              className={styles.youtube}
              src={require('../images/kv/youtube.png')}
              alt=""
            />
          </a>

          <a target="_blank" href="https://thethroneofgirl.smartplay.com.tw/">
            <img
              className={styles.goindex}
              src={require('../images/kv/goindex.png')}
              alt=""
            />
          </a>
        </div>
      ) : (
        <div className={styles.topbar2}>
          <a target="_blank" href="https://www.facebook.com/TheThroneOfGirlTW/">
            <img
              className={styles.fb}
              src={require('../images/01/fb.png')}
              alt=""
            />
          </a>
          <a target="_blank" href="https://thethroneofgirl.smartplay.com.tw/">
            <img
              className={styles.goindex}
              src={require('../images/kv/goindex.png')}
              alt=""
            />
          </a>

          {uid ? (
            <div onClick={() => setUid('')} className={styles.logout}>
              <img
                className={styles.loginbtn}
                src={require('../images/login/logout.png')}
              />
              <div>{userInfo.name}</div>
            </div>
          ) : (
            <img
              className={styles.dl}
              onClick={() => setShowOtherLoginErrorModal(true)}
              src={require('../images/01/dl.png')}
              alt=""
            />
          )}
        </div>
      )}
      {swiperIndex != 0 && (
        <div className={styles.navbar}>
          <div className={styles.left}>
            <div className={styles.item} onClick={() => swiper.slideTo(0)}>
              首页
            </div>
            <div className={styles.item} onClick={() => swiper.slideTo(1)}>
              立即预约
            </div>
            <div className={styles.item} onClick={() => swiper.slideTo(2)}>
              召集好友
            </div>
            <div className={styles.item} onClick={() => swiper.slideTo(3)}>
              福利抽奖
            </div>
            <div className={styles.item} onClick={() => swiper.slideTo(4)}>
              游戏特色
            </div>
          </div>
          <div className={styles.right}>
            <img
              className={styles.barbg}
              src={require('../images/kv/bar-bg.png')}
              alt=""
            />
            <div
              onClick={() => swiper.slideTo(0)}
              className={
                styles.item + ' ' + (swiperIndex == 0 && styles.active)
              }
            ></div>
            <div
              onClick={() => swiper.slideTo(1)}
              className={
                styles.item + ' ' + (swiperIndex == 1 && styles.active)
              }
            ></div>
            <div
              onClick={() => swiper.slideTo(2)}
              className={
                styles.item + ' ' + (swiperIndex == 2 && styles.active)
              }
            ></div>
            <div
              onClick={() => swiper.slideTo(3)}
              className={
                styles.item + ' ' + (swiperIndex == 3 && styles.active)
              }
            ></div>
            <div
              onClick={() => swiper.slideTo(4)}
              className={
                styles.item + ' ' + (swiperIndex == 4 && styles.active)
              }
            ></div>
          </div>
        </div>
      )}
      <div className="swiper-container">
        <div className="swiper-wrapper">
          <div className={'swiper-slide ' + styles.slide1}>
            <div className={styles.kv}>
              <img src={require('../images/kv/BG.png')} alt="" />
              <div className={styles.hotbox}>
                <img
                  className={styles.logo}
                  src={require('../images/kv/LOGO.png')}
                />
                <img
                  className={styles.yuyue}
                  onClick={() => swiper.slideTo(1)}
                  src={require('../images/kv/yuyue.png')}
                />
                <div className={styles.number}>
                  已 有 {indexData.total} 位 公 主 蒞 臨 米 德 加 爾 特 大 陸
                </div>
                <div className={styles.download}>
                  <a target="_blank" href="https://cutt.ly/5fTbEii">
                    <img
                      className={styles.gp}
                      src={require('../images/kv/GP.png')}
                    />
                  </a>
                  <a target="_blank" href="https://cutt.ly/BfTbRjb">
                    <img
                      className={styles.ios}
                      src={require('../images/kv/IOS.png')}
                    />
                  </a>
                </div>
              </div>
              <img
                className={styles.tips}
                src={require('../images/kv/tips.png')}
              />
            </div>
          </div>
          <div className={'swiper-slide ' + styles.slide2}>
            <div className={styles.numbers}>
              <div className={styles.top}>已加入/per-registration</div>
              <div className={styles.bottom}>{indexData.total}位公主</div>
            </div>
            <div className={styles.process}>
              {/* <div className={styles.imgs}>
              <img className={styles.item} src={require('../images/01/circle.png')} />
              <img className={styles.item} src={require('../images/01/circle.png')} />
              <img className={styles.item} src={require('../images/01/circle.png')} />
              <img className={styles.item} src={require('../images/01/circle.png')} />
              <img className={styles.item} src={require('../images/01/circle.png')} />
            </div> */}
              <div className={styles.bgbar}>
                {/* <div className={styles.active}>
                <div className={styles.border}></div>
              </div> */}
                <img
                  style={{ left: indexData.total / 30000 + '%' }}
                  className={styles.jd}
                  src={require('../images/01/jd.png')}
                />
                {/* <div className={styles.gray}>
                <div className={styles.border}></div>
              </div> */}
              </div>
            </div>
            <img
              onClick={() => setShowLoginModal(true)}
              className={styles.yuyue}
              src={require('../images/01/yuyue.png')}
            />
            <div className={styles.gifts}>
              <div className={styles.item}>
                {indexData.number > 200000 && (
                  <img
                    className={styles.yidacheng}
                    src={require('../images/01/yidacheng.png')}
                  />
                )}
              </div>
              <div className={styles.item}>
                {indexData.number > 500000 && (
                  <img
                    className={styles.yidacheng}
                    src={require('../images/01/yidacheng.png')}
                  />
                )}{' '}
              </div>
              <div className={styles.item}>
                {indexData.number > 1000000 && (
                  <img
                    className={styles.yidacheng}
                    src={require('../images/01/yidacheng.png')}
                  />
                )}{' '}
              </div>
              <div className={styles.item}>
                {indexData.number > 2000000 && (
                  <img
                    className={styles.yidacheng}
                    src={require('../images/01/yidacheng.png')}
                  />
                )}{' '}
              </div>
              <div className={styles.item}>
                {indexData.number > 3000000 && (
                  <img
                    className={styles.yidacheng}
                    src={require('../images/01/yidacheng.png')}
                  />
                )}{' '}
              </div>
            </div>
            <img src={require('../images/01/01.png')} alt="" />
          </div>
          <div className={'swiper-slide ' + styles.slide3}>
            <div className={styles.numbers}>
              <div className={styles.top}>已召集/invitation</div>
              <div className={styles.bottom}>{userInfo.number}位好友</div>
              <div className={styles.list}>
                {[0, 1, 2].map(item => (
                  <div className={styles.item}>
                    {item < userInfo.number && (
                      <img src={require('../images/01/yidacheng.png')} alt="" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <img
              onClick={() => {
                if (!uid) {
                  setShowOtherLoginErrorModal(true);
                  return;
                }
                setShowCopyModal(true);
              }}
              className={styles.zj}
              src={require('../images/02/zj.png')}
              alt=""
            />
            <img src={require('../images/02/02.png')} alt="" />
          </div>
          <div className={'swiper-slide ' + styles.slide4}>
            <a
              target="_blank"
              href="https://www.facebook.com/TheThroneOfGirlTW/"
            >
              <img
                className={styles.fb}
                src={require('../images/03/fb.png')}
                alt=""
              />
            </a>
            <img src={require('../images/03/03.png')} alt="" />
          </div>
          <div className={'swiper-slide ' + styles.slide5}>
            <div className={styles.test}>
              <div className="swiper-container2">
                <div className="swiper-wrapper">
                  <div className="swiper-slide item">
                    <img
                      className="swiper-lazy"
                      src={require('../images/04/1.png')}
                      alt=""
                    />
                  </div>
                  <div className="swiper-slide item">
                    <img
                      className="swiper-lazy"
                      src={require('../images/04/2.png')}
                      alt=""
                    />
                  </div>
                  <div className="swiper-slide item">
                    <img
                      className="swiper-lazy"
                      src={require('../images/04/3.png')}
                      alt=""
                    />
                  </div>
                  <div className="swiper-slide item">
                    <img
                      className="swiper-lazy"
                      src={require('../images/04/4.png')}
                      alt=""
                    />
                  </div>
                  <div className="swiper-slide item">
                    <img
                      className="swiper-lazy"
                      src={require('../images/04/5.png')}
                      alt=""
                    />
                  </div>
                  <div className="swiper-slide item">
                    <img
                      className="swiper-lazy"
                      src={require('../images/04/6.png')}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-pagination"></div>
            <img src={require('../images/04/04.png')} alt="" />
          </div>
          <div className={'swiper-slide ' + styles.slide6}>
            <section className={styles.copyright}>
              <img
                className={styles.logo}
                src={require('../images/copyright/name.png')}
                alt=""
              />
              <div className={styles.hr}></div>
              <img
                className={styles.logo + ' ' + styles.name}
                src={require('../images/copyright/logo.png')}
                alt=""
              />
              <img
                className={styles.logo + ' ' + styles.l12}
                src={require('../images/copyright/l12.png')}
                alt=""
              />

              <div className={styles.info}>
                <div className={styles.linklist}>
                  <a
                    target="_blank"
                    href="https://thethroneofgirl.smartplay.com.tw/termsofservice.html"
                    className={styles.item}
                  >
                    用戶協議
                  </a>
                  <a
                    target="_blank"
                    href="https://thethroneofgirl.smartplay.com.tw/privacypolicy.html"
                    className={styles.item}
                  >
                    隱私協議
                  </a>
                  <a
                    target="_blank"
                    href="mailto:thethroneofgirlcs@yahoo.com"
                    className={styles.item}
                  >
                    聯絡我們
                  </a>
                </div>
                <div class="tip">
                  *本軟體依遊戲軟體分級管理辦法，分類為輔導級12+。
                </div>
                <div class="tip">
                  *本應用遊戲內容涉及｢戀愛結婚」-遊戲設計促使使用者虛擬戀愛或結婚
                </div>
                <div class="tip">
                  *本遊戲為免費試用，內另有提供購買虛擬遊戲幣、物品等付費服務
                </div>
                <div class="tip">*請注意遊戲時間，避免沉迷</div>
                <div class="tip">
                  © 2020 Smartplay Interactive Technology Co., LTD All rights
                  reserved
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <div className={styles.modal}>
          <div
            className={styles.mask}
            onClick={() => setShowLoginModal(false)}
          ></div>
          <div className={styles.container}>
            <img
              className={styles.close}
              onClick={() => setShowLoginModal(false)}
              src={require('../images/01/close.png')}
            />
            <div className={styles.formlist}>
              <div className={styles.item}>
                <select name="" id="" onChange={changeSource}>
                  <option value="1">台湾886</option>
                  <option value="2">香港886</option>
                  <option value="3">澳门886</option>
                </select>
                <input
                  onChange={e => changeInput(e.target.value, 'phone')}
                  className={styles.phone}
                  placeholder="請輸入手機號碼"
                  type="text"
                />
              </div>
              <div className={styles.item}>
                <input
                  onChange={e => changeInput(e.target.value, 'code')}
                  className={styles.num}
                  placeholder="請輸入驗證碼"
                  type="text"
                />
                <div onClick={() => sendCode()} className={styles.code}>
                  {time <= 0 ? '獲取驗證碼' : time + 's'}
                </div>
              </div>
              <div className={styles.item + ' ' + styles.rule}>
                <img
                  onClick={() => setRadioStatus(!radioStatus)}
                  src={
                    radioStatus
                      ? require('../images/01/radio-s.png')
                      : require('../images/01/radio.png')
                  }
                  alt=""
                />
                <div>
                  我同意{' '}
                  <a href="https://thethroneofgirl.smartplay.com.tw/termsofservice.html">
                    《用戶條款》
                  </a>
                  、
                  <a href="https://thethroneofgirl.smartplay.com.tw/privacypolicy.html">
                    《隱私協議》
                  </a>
                  並接受測試相關資訊
                </div>
              </div>
              <img
                onClick={() => login()}
                className={styles.submit}
                src={require('../images/01/yuyue.png')}
                alt=""
              />
            </div>
          </div>
        </div>
      )}
      {showYuyueSuccessModal && (
        <div className={styles.modal + ' ' + styles.success}>
          <div
            className={styles.mask}
            onClick={() => setShowYuyueSuccessModal(false)}
          ></div>
          <div className={styles.container}>
            <img
              className={styles.close}
              onClick={() => setShowYuyueSuccessModal(false)}
              src={require('../images/01/close.png')}
            />
            <div className={styles.successtext}>恭喜您，預約成功！</div>
            <img
              className={styles.submit}
              src={require('../images/01/qr.png')}
              alt=""
            />
          </div>
        </div>
      )}
      {showLoginErrorModal && (
        <div className={styles.modal + ' ' + styles.success}>
          <div
            className={styles.mask}
            onClick={() => setShowLoginErrorModal(false)}
          ></div>
          <div className={styles.container}>
            <img
              className={styles.close}
              onClick={() => setShowLoginErrorModal(false)}
              src={require('../images/01/close.png')}
            />
            <div className={styles.successtext}>{errText}</div>
            <img
              className={styles.submit}
              onClick={() => setShowLoginErrorModal(false)}
              src={require('../images/01/qr.png')}
              alt=""
            />
          </div>
        </div>
      )}
      {showOtherLoginErrorModal && (
        <div className={styles.modal + ' ' + styles.login}>
          <div
            className={styles.mask}
            onClick={() => setShowOtherLoginErrorModal(false)}
          ></div>
          <div className={styles.container}>
            <img
              className={styles.close}
              onClick={() => setShowOtherLoginErrorModal(false)}
              src={require('../images/01/close.png')}
            />
            <div className={styles.text}>使用以下第三方帳號登錄</div>
            <div className={styles.list}>
              <a href={indexData.apple_url}>
                <img
                  className={styles.item}
                  src={require('../images/login/APPLE.png')}
                  alt=""
                />
              </a>
              <a href={indexData.facebook_url}>
                <img
                  className={styles.item}
                  src={require('../images/login/fb.png')}
                  alt=""
                />
              </a>
              <a href={indexData.google_url}>
                <img
                  className={styles.item}
                  src={require('../images/login/google.png')}
                  alt=""
                />
              </a>
            </div>
          </div>
        </div>
      )}
      {showRuleModal && (
        <div className={styles.modal + ' ' + styles.rule}>
          <div
            className={styles.mask}
            onClick={() => setShowRuleModal(false)}
          ></div>
          <div className={styles.container}>
            <img
              className={styles.close}
              onClick={() => setShowRuleModal(false)}
              src={require('../images/01/close.png')}
            />
            <img
              className={styles.ruleimg}
              src={require('../images/login/rule.png')}
            />
          </div>
        </div>
      )}
      {showCopyModal && (
        <div className={styles.modal + ' ' + styles.copyModal}>
          <div
            className={styles.mask}
            onClick={() => setShowCopyModal(false)}
          ></div>
          <div className={styles.container}>
            <img
              className={styles.close}
              onClick={() => setShowCopyModal(false)}
              src={require('../images/01/close.png')}
            />
            <div className={styles.tip}>複製您的專屬網址，召集好友拿好禮！</div>
            <div className={styles.code} value={userInfo.share_url}></div>
            <img
              onClick={() => copyText()}
              className={styles.submit}
              src={require('../images/02/copy.png')}
              alt=""
            />
          </div>
        </div>
      )}
      {showCopySuccess && (
        <div className={styles.modal + ' ' + styles.success}>
          <div
            className={styles.mask}
            onClick={() => setShowCopySuccess(false)}
          ></div>
          <div className={styles.container}>
            <img
              className={styles.close}
              onClick={() => setShowCopySuccess(false)}
              src={require('../images/01/close.png')}
            />
            <div className={styles.successtext}>
              複製成功，快去分享給好友吧~
            </div>
            <img
              className={styles.submit}
              onClick={() => setShowCopySuccess(false)}
              src={require('../images/01/qr.png')}
              alt=""
            />
          </div>
        </div>
      )}
    </div>
  );
};

function copyToClipboard(text) {
  if (text.indexOf('-') !== -1) {
    let arr = text.split('-');
    text = arr[0] + arr[1];
  }
  var textArea = document.createElement('textarea');
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = '0';
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful
      ? '成功复制到剪贴板'
      : '该浏览器不支持点击复制到剪贴板';
    alert(msg);
  } catch (err) {
    alert('该浏览器不支持点击复制到剪贴板');
  }

  document.body.removeChild(textArea);
}
