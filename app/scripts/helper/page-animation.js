/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 /**
  * @fileOverview Animations for page transitions.
  */

IOWA.PageAnimation = (function() {

  var CONTENT_SLIDE_DURATION = 400;
  var CONTENT_SLIDE_DELAY = 200;
  var CONTENT_SLIDE_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
  var CONTENT_SLIDE_LENGTH = '100px';

  var CONTENT_SLIDE_OPTIONS = {
      duration: CONTENT_SLIDE_DURATION,
      easing: CONTENT_SLIDE_EASING,
      fill: 'forwards'
  };

  var CONTENT_SLIDE_DELAY_OPTIONS = {
      duration: CONTENT_SLIDE_DURATION,
      delay: CONTENT_SLIDE_DELAY,
      easing: CONTENT_SLIDE_EASING,
      fill: 'forwards'
  };

  /**
   * Fades element out.
   * @param {Element} el DOM element.
   * @param {Object} option Options for the transition, e.g. duration.
   * @return {Animation} Ripple animation definition.
   */
  function elementFadeOut(el, options) {
    options.fill = 'forwards'; // Always keep the state at the end of animation.
    return new Animation(el, [{opacity: 1}, {opacity: 0}], options);
  }

  /**
   * Fades element in.
   * @param {Element} el DOM element.
   * @param {Object} option Options for the transition, e.g. duration.
   * @return {Animation} Ripple animation definition.
   */
  function elementFadeIn(el, options) {
    options.fill = 'forwards'; // Always keep the state at the end of animation.
    return new Animation(el, [{opacity: 0}, {opacity: 1}], options);
  }

  /**
   * Returns an animation to slide and fade out the main content of the page.
   * Used together with contentSlideIn for page transitions.
   * @return {Animation} Page animation definition.
   */
  function contentSlideOut() {
    var main = IOWA.Elements.Main.querySelector('.slide-up');
    var mainDelayed = IOWA.Elements.Main.querySelector('.slide-up-delay');
    var start = {
      transform: 'translate(0, 0)',
      opacity: 1
    };
    var end = {
      transform: 'translate(0, ' + CONTENT_SLIDE_LENGTH + ')',
      opacity: 0
    };
    return new AnimationGroup([
      new Animation(main, [start, end], CONTENT_SLIDE_DELAY_OPTIONS),
      new Animation(mainDelayed, [start, end], CONTENT_SLIDE_OPTIONS),
      elementFadeOut(IOWA.Elements.MastheadMeta, CONTENT_SLIDE_OPTIONS),
      elementFadeOut(IOWA.Elements.IOLogoLarge, CONTENT_SLIDE_OPTIONS),
      elementFadeOut(IOWA.Elements.Footer, {duration: 0}) // Hide instantly.
    ]);
  }

  /**
   * Returns an animation to slide up and fade in the main content of the page.
   * Used together with contentSlideOut for page transitions.
   * TODO: Should be possible by reversing slideout animation.
   * @return {Animation} Page animation definition.
   */
  function contentSlideIn() {
    var main = IOWA.Elements.Main.querySelector('.slide-up');
    var mainDelayed = IOWA.Elements.Main.querySelector('.slide-up-delay');
    var start = {
      transform: 'translate(0, ' + CONTENT_SLIDE_LENGTH + ')',
      opacity: 0
    };
    var end = {
      transform: 'translate(0, 0)',
      opacity: 1
    };
    return new AnimationGroup([
      new Animation(main, [start, end], CONTENT_SLIDE_OPTIONS),
      new Animation(mainDelayed, [start, end], CONTENT_SLIDE_DELAY_OPTIONS),
      elementFadeIn(IOWA.Elements.Footer, CONTENT_SLIDE_DELAY_OPTIONS)
    ]);
  }

  /**
   * Returns an animation to slide the top nav out of the screen.
   * @return {Animation} Page animation definition.
   */
  function navSlideOut() {
    return new Animation(IOWA.Elements.Nav, [
       {transform: 'translateY(0)'},
       {transform: 'translateY(-100%)'}
    ], CONTENT_SLIDE_OPTIONS);
  }

  /**
   * Returns an animation to slide the top nav into the screen.
   * @return {Animation} Page animation definition.
   */
  function navSlideIn() {
    return new Animation(IOWA.Elements.Nav, [
       {transform: 'translateY(-100%)'},
       {transform: 'translateY(0)'}
    ], CONTENT_SLIDE_OPTIONS);
  }

  /**
   * Returns an animation to play a color ink ripple.
   * @param {Element} ripple Ripple DOM element.
   * @param {number} x X coordinate of the center of the ripple.
   * @param {number} y Y coordinate of the center of the ripple.
   * @param {number} duration How long is the animation.
   * @param {string} duration color Ripple color.
   * @param {boolean} isFadeRipple If true, play a temporary glimpse ripple.
   *     If false, play a regular opaque color ripple.
   * @return {Animation} Ripple animation definition.
   */
  function rippleEffect(ripple, x, y, duration, color, isFadeRipple) {
    var translate = 'translate3d(' + x + 'px,' + y + 'px, 0)';
    var start = {
      transform: translate + ' scale(0)',
      opacity: isFadeRipple ? 0.5 : 1,
      backgroundColor: color
    };
    var end = {
      transform: translate + ' scale(1)',
      opacity: isFadeRipple ? 0 : 1,
      backgroundColor: color
    };
    var animation = new Animation(ripple, [start, end], {
        duration: duration,
        fill: 'forwards'  // Makes ripple keep its state at the end of animation
    });
    return animation;
  }

  /**
   * An animation for the first page render. It slides the content in
   * and fades in the masthead meta.
   * @return {Animation} Ripple animation definition.
   */
  function pageFirstRender() {
    return new AnimationGroup([
      contentSlideIn(),
      elementFadeIn(IOWA.Elements.MastheadMeta, CONTENT_SLIDE_OPTIONS)
    ], CONTENT_SLIDE_OPTIONS);
  }

  /**
   * An animation for the page slide in transition. It slides the content in
   * and fades in the masthead meta and IO logo.
   * @return {Animation} Ripple animation definition.
   */
  function pageSlideIn() {
    var animationGroup =  new AnimationGroup([
      contentSlideIn(),
      elementFadeIn(IOWA.Elements.MastheadMeta, CONTENT_SLIDE_OPTIONS),
      elementFadeIn(IOWA.Elements.IOLogoLarge, CONTENT_SLIDE_OPTIONS)
    ], CONTENT_SLIDE_OPTIONS);
    return animationGroup;
  }

  /**
   * Returns an animation to play a hero card takeover animation. The card
   *     plays a ripple on itself and grows to cover the masthead.
   * @param {Element} card Card DOM element.
   * @param {number} x X coordinate of the center of the ripple.
   * @param {number} x Y coordinate of the center of the ripple.
   * @param {number} duration Duration of the animation.
   * @param {string} color Color of the ripple.
   * @return {Animation} Ripple animation definition.
   */
  function pageCardTakeoverOut(card, x, y, duration, color) {
    var ripple = card.querySelector('.ripple__content');
    var rippleRect = IOWA.Util.resizeRipple(ripple);
    ripple.style.backgroundColor = color;
    ripple.parentNode.style.zIndex = 2;

    var mastheadRect = IOWA.Elements.Masthead.getBoundingClientRect();
    var scaleX = mastheadRect.width / rippleRect.width;
    var scaleY = mastheadRect.height / rippleRect.height;
    var scale = 'scale(' + scaleX + ', ' + scaleY + ')';
    var translate = 'translate3d(' + (-rippleRect.left) + 'px,' +
        (-rippleRect.top)  + 'px, 0)';

    card.style.transformOrigin = '0 0';
    var cardTransition = new Animation(card, [
        {transform: 'translate3d(0, 0, 0) scale(1)'},
        {transform: [translate, scale].join(' ')}
      ], {
        duration: duration,
        fill: 'forwards'
    });

    var mainDelayed = IOWA.Elements.Main.querySelector('.slide-up-delay');

    // First run the hero card takeover...
    var animationGroup = new AnimationGroup([
      rippleEffect(ripple, x - rippleRect.left, y - rippleRect.top, duration),
      cardTransition,
      navSlideOut(),
      elementFadeOut(mainDelayed, CONTENT_SLIDE_OPTIONS)
    ]);

    // ...then hide the content under the hero unit.
    return new AnimationSequence([
      animationGroup,
      elementFadeOut(IOWA.Elements.Ripple, {duration: 0}), // Hide instantly.
      elementFadeOut(IOWA.Elements.IOLogoLarge, {duration: 0}), // Same.
      elementFadeOut(IOWA.Elements.Footer, {duration: 0}),  // Same.
      elementFadeOut(IOWA.Elements.MastheadMeta, {duration: 0}) // Same.
    ]);
  }

  /**
   * An animation for the page hero card transition. It slides the page
   * and the top navigation in.
   * @return {Animation} Ripple animation definition.
   */
  function pageCardTakeoverIn() {
    return new AnimationGroup([
      pageSlideIn(),
      navSlideIn()
    ], CONTENT_SLIDE_OPTIONS);
  }

  /**
   * Plays an animation, animation group or animation sequence. Calls
   *     a callback when it finishes, if one was assigned.
   * @param {TimedSequence} Animation of AnimationGroup or AnimationSequence.
   */
  function play(animation, callback) {
    var player = document.timeline.play(animation);
    if (callback) {
      player.onfinish = function(e) {
        callback();
      };
    }
  }

  return {
    elementFadeOut: elementFadeOut,
    elementFadeIn: elementFadeIn,
    contentSlideOut: contentSlideOut,
    contentSlideIn: contentSlideIn,
    pageSlideIn: pageSlideIn,
    pageCardTakeoverOut: pageCardTakeoverOut,
    pageCardTakeoverIn: pageCardTakeoverIn,
    pageFirstRender: pageFirstRender,
    ripple: rippleEffect,
    play: play
  };

})();
