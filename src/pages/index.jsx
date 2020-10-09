import React, { useEffect, useState } from 'react';
import styles from './index.less';
// import Swiper from 'swiper';
// import 'swiper/swiper.less';

export default () => {

  const [showLoginModal, setShowLoginModal] = useState(false)
  const [swiperIndex, setSwiperIndex] = useState(0)

  useEffect(() => {
    var swiper = new Swiper('.swiper-container', {
      direction: 'vertical',
      slidesPerView: 'auto',
      spaceBetween: 0,
      mousewheel: true,
      allowTouchMove: false,
      on: {
        transitionEnd: function () {
          setSwiperIndex(this.activeIndex)
        },
      }
    });
    var swiper2 = new Swiper('.swiper-container2', {
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
      coverflowEffect: {
        rotate: -40,
        stretch: -50,
        depth: 300,
        modifier: 1,
        slideShadows: true,
      },
      flipEffect: {
        slideShadows: true,
        limitRotation: true,
      },
      pagination: {
        el: '.swiper-pagination',
      },
      on: {
        progress: function (progress) {
          for (var i = 0; i < this.slides.length; i++) {
            var slide = this.slides.eq(i);
            var slideProgress = this.slides[i].progress;
            var modify = 1;
            if (Math.abs(slideProgress) > 1) {
              modify = (Math.abs(slideProgress) - 1) * 0.3 + 1;
            }
            var translate = slideProgress * modify * 260 + 'px';
            var scale = 1 - Math.abs(slideProgress) / 5;
            var zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
            slide.transform('translateX(' + translate + ') scale(' + scale + ')');
            slide.css('zIndex', zIndex);
            slide.css('opacity', 1);
            if (Math.abs(slideProgress) > 3) {
              slide.css('opacity', 0);
            }
          }
        },
        setTransition: function (transition) {
          for (var i = 0; i < this.slides.length; i++) {
            var slide = this.slides.eq(i)
            slide.transition(transition);
          }

        }
      }
    });
  }, []);

  return (
    <div className={styles.app}>
      {
        swiperIndex == 0 ? <div className={styles.topbar}>
          <img className={styles.youtube} src={require('../images/kv/youtube.png')} alt="" />
          <img className={styles.youtube} src={require('../images/kv/fb.png')} alt="" />
          <img className={styles.goindex} src={require('../images/kv/goindex.png')} alt="" />
        </div> : <div className={styles.topbar2}>
            <img className={styles.fb} src={require('../images/01/fb.png')} alt="" />
            <img className={styles.goindex} src={require('../images/kv/goindex.png')} alt="" />
            <img className={styles.dl} onClick={() => setShowLoginModal(true)} src={require('../images/01/dl.png')} alt="" />
          </div>
      }
      {
        swiperIndex != 0 && <div className={styles.navbar}>
          <div className={styles.left}>
            <div className={styles.item}>首页</div>
            <div className={styles.item}>立即预约</div>
            <div className={styles.item}>召集好友</div>
            <div className={styles.item}>福利抽奖</div>
            <div className={styles.item}>游戏特色</div>
          </div>
          <div className={styles.right}>
            <img className={styles.barbg} src={require('../images/kv/bar-bg.png')} alt="" />
            <div className={styles.item + ' ' + (swiperIndex == 0 && styles.active)}></div>
            <div className={styles.item + ' ' + (swiperIndex == 1 && styles.active)}></div>
            <div className={styles.item + ' ' + (swiperIndex == 2 && styles.active)}></div>
            <div className={styles.item + ' ' + (swiperIndex == 3 && styles.active)}></div>
            <div className={styles.item + ' ' + (swiperIndex == 4 && styles.active)}></div>
          </div>
        </div>
      }
      <div className="swiper-container">
        <div className="swiper-wrapper">
          <div className={'swiper-slide ' + styles.slide1}>
            <div className={styles.kv}>
              <img src={require('../images/kv/BG.png')} alt="" />
              <div className={styles.hotbox}>
                <img className={styles.logo} src={require('../images/kv/LOGO.png')} />
                <img className={styles.yuyue} onClick={() => setShowLoginModal(true)} src={require('../images/kv/yuyue.png')} />
                <div className={styles.number}>已有123456位公主蒞臨米德加爾特大陸</div>
                <div className={styles.download}>
                  <img className={styles.gp} src={require('../images/kv/GP.png')} />
                  <img className={styles.ios} src={require('../images/kv/IOS.png')} />
                </div>
              </div>
              <img className={styles.tips} src={require('../images/kv/tips.png')} />
            </div>
          </div>
          <div className={'swiper-slide ' + styles.slide2}>
            <div className={styles.numbers}>
              <div className={styles.top}>已加入/per-registration</div>
              <div className={styles.bottom}>256,356,0位公主</div>
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
                <img className={styles.jd} src={require('../images/01/jd.png')} />
                {/* <div className={styles.gray}>
                <div className={styles.border}></div>
              </div> */}
              </div>
            </div>
            <img className={styles.yuyue} src={require('../images/01/yuyue.png')} />
            <div className={styles.gifts}>
              <div className={styles.item}>
                <img className={styles.yidacheng} src={require('../images/01/yidacheng.png')} />
              </div>
              <div className={styles.item}>
                <img className={styles.yidacheng} src={require('../images/01/yidacheng.png')} />
              </div>
              <div className={styles.item}>
                <img className={styles.yidacheng} src={require('../images/01/yidacheng.png')} />
              </div>
              <div className={styles.item}>
                <img className={styles.yidacheng} src={require('../images/01/yidacheng.png')} />
              </div>
              <div className={styles.item}>
                <img className={styles.yidacheng} src={require('../images/01/yidacheng.png')} />
              </div>
            </div>
            <img src={require('../images/01/01.png')} alt="" />
          </div>
          <div className={'swiper-slide ' + styles.slide3}>
            <div className={styles.numbers}>
              <div className={styles.top}>已召集/invitation</div>
              <div className={styles.bottom}>1位好友</div>
            </div>
            <img className={styles.zj} src={require('../images/02/zj.png')} alt="" />
            <img src={require('../images/02/02.png')} alt="" />
          </div>
          <div className={'swiper-slide ' + styles.slide4}>
            <img className={styles.fb} src={require('../images/03/fb.png')} alt="" />
            <img src={require('../images/03/03.png')} alt="" />
          </div>
          <div className={'swiper-slide ' + styles.slide5}>
            <div className={styles.test}>
              <div className="swiper-container2">
                <div className="swiper-wrapper">
                  <div className="swiper-slide item">
                    <img className="swiper-lazy" src={require('../images/04/001.jpg')} alt="" />
                  </div>
                  <div className="swiper-slide item">
                    <img className="swiper-lazy" src={require('../images/04/002.jpg')} alt="" />
                  </div>
                  <div className="swiper-slide item">
                    <img className="swiper-lazy" src={require('../images/04/003.jpg')} alt="" />
                  </div>
                  <div className="swiper-slide item">
                    <img className="swiper-lazy" src={require('../images/04/004.jpg')} alt="" />
                  </div>
                  <div className="swiper-slide item">
                    <img className="swiper-lazy" src={require('../images/04/005.jpg')} alt="" />
                  </div>
                  <div className="swiper-slide item">
                    <img className="swiper-lazy" src={require('../images/04/006.jpg')} alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-pagination"></div>
            <img src={require('../images/04/04.png')} alt="" />
          </div>
          <div className={'swiper-slide ' + styles.slide6}>
            <section className={styles.copyright}>
              <img className={styles.logo} src={require('../images/copyright/name.png')} alt="" />
              <div className={styles.hr}></div>
              <img className={styles.logo + ' ' + styles.name} src={require('../images/copyright/logo.png')} alt="" />
              <div className={styles.info}>
                <div className={styles.linklist}>
                  <a target="_blank" href="https://thethroneofgirl.smartplay.com.tw/termsofservice.html" className={styles.item}>用戶協議</a>
                  <a target="_blank" href="https://thethroneofgirl.smartplay.com.tw/privacypolicy.html" className={styles.item}>隱私協議</a>
                  <a target="_blank" href="mailto:thethroneofgirlcs@yahoo.com" className={styles.item}>聯絡我們</a>
                </div>
                <div className={styles.tip}>本遊戲為免費使用，部分內容, 服務或虛擬貨幣需在遊戲內另行購買。請注意遊戲時間，避免沉迷。</div>
                <div className={styles.tip}>智娛互動科技有限公司 557338</div>
                <div className={styles.tip}>臺北市松山區</div>
                <div className={styles.tip}>© 2020 Smartplay Interactive Technol</div>
              </div>
            </section>
          </div>
        </div>
      </div>
      {
        showLoginModal && <div className={styles.modal}>
          <div className={styles.mask} onClick={() => setShowLoginModal(false)}></div>
          <div className={styles.container}>
            <img className={styles.close} onClick={() => setShowLoginModal(false)} src={require('../images/01/close.png')} />
            <div className={styles.formlist}>
              <div className={styles.item}>
                <select name="" id="">
                  <option value="">台湾886</option>
                </select>
                <input className={styles.phone} placeholder="請輸入手機號碼" type="text" />
              </div>
              <div className={styles.item}>
                <input className={styles.num} placeholder="請輸入驗證碼" type="text" />
                <div className={styles.code}>獲取驗證碼</div>
              </div>
              <div className={styles.item}>
                <img src={require('../images/01/radio.png')} alt="" />
                <div>我同意《使用者協議》、《隱私權政策》並接受測試相關資訊</div>
              </div>
              <img className={styles.submit} src={require('../images/01/yuyue.png')} alt="" />
            </div>
          </div>
        </div>
      }
    </div>
  );
}
