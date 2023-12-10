import React, { FC, HTMLAttributes } from 'react';

import classes from './Logo.module.scss';

interface LogoProps extends HTMLAttributes<SVGSVGElement> {}

export const Logo: FC<LogoProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
      {...props}>
      <defs>
        <linearGradient
          id="b"
          x1="113.22"
          y1="54.69"
          x2="165.78"
          y2="94.31"
          gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0" stopColor="#d51f00" />
          <stop offset="1" stopColor="#ff2d00" />
        </linearGradient>
        <linearGradient
          id="c"
          x1="163"
          y1="166.5"
          x2="226"
          y2="166.5"
          gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ff9300" />
          <stop offset="1" stopColor="#ffa600" />
        </linearGradient>
        <linearGradient
          id="d"
          x1="117.25"
          y1="371.25"
          x2="161.75"
          y2="326.75"
          gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#324e6a" />
          <stop offset="1" stopColor="#475d70" />
        </linearGradient>
        <linearGradient id="e" x1="116" y1="417.5" x2="163" y2="417.5" xlinkHref="#c" />
        <radialGradient
          id="f"
          cx="325.5"
          cy="219.62"
          fx="325.5"
          fy="219.62"
          r="296.84"
          gradientTransform="translate(418 883) rotate(-180)"
          gradientUnits="userSpaceOnUse">
          <stop offset=".68" stopColor="#004377" />
          <stop offset=".83" stopColor="#003b69" />
          <stop offset=".89" stopColor="#002546" />
          <stop offset="1" stopColor="#001d39" />
        </radialGradient>
        <radialGradient
          id="g"
          cx="317.14"
          cy="159.55"
          fx="317.14"
          fy="159.55"
          r="80.42"
          gradientUnits="userSpaceOnUse">
          <stop offset=".59" stopColor="#f4d7a6" />
          <stop offset=".86" stopColor="#ead1a2" />
          <stop offset=".9" stopColor="#c6ba91" />
          <stop offset="1" stopColor="#b8b18b" />
        </radialGradient>
        <linearGradient
          id="h"
          x1="199.9"
          y1="252.01"
          x2="226"
          y2="252.01"
          gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ff9f00" />
          <stop offset="1" stopColor="#ffa300" />
        </linearGradient>
        <linearGradient id="i" x1="338.6" y1="108.24" x2="367.48" y2="79.36" xlinkHref="#b" />
        <radialGradient
          id="j"
          cx="289.78"
          cy="349.63"
          fx="289.78"
          fy="349.63"
          r="122.77"
          gradientUnits="userSpaceOnUse">
          <stop offset=".82" stopColor="#fff8d2" />
          <stop offset="1" stopColor="#002546" />
        </radialGradient>
        <linearGradient
          id="k"
          x1="320"
          y1="111.82"
          x2="399.86"
          y2="111.82"
          gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="orange" />
          <stop offset=".62" stopColor="#ffa400" />
          <stop offset="1" stopColor="#ff8300" />
        </linearGradient>
      </defs>
      <path
        className={classes.ac}
        d="M403,181.89v-21.85c0-60.22-48.82-109.04-109.04-109.04H116V465h176.4c61.08,0,110.6-49.52,110.6-110.6v-30.14c0-37.7-35-68.26-41-68.26h2c9,0,39-33.18,39-74.11Z"
      />
      <path
        className={classes.aa}
        d="M403,181.89v-21.85c0-8.98-1.09-17.7-3.14-26.04h-79.86v36.98c0,26.07-21.13,47.2-47.2,47.2h-46.8v67.69h51.93c23.24,0,42.07,18.84,42.07,42.07h0c0,23.24-18.84,42.07-42.07,42.07h-51.93v48h94v-74.66h83v-19.08c0-37.7-35-68.26-41-68.26h2c9,0,39-33.18,39-74.11Zm-121.26,101.18c-17.42,0-31.55-14.12-31.55-31.55s14.12-31.55,31.55-31.55,31.55,14.12,31.55,31.55-14.12,31.55-31.55,31.55Z"
      />
      <rect className={classes.u} x="116" y="51" width="47" height="47" />
      <rect className={classes.aa} x="163" y="51" width="63" height="47" />
      <rect className={classes.aa} x="226" y="98" width="62" height="17" />
      <rect className={classes.aa} x="226" y="134" width="62" height="17" />
      <rect className={classes.t} x="163" y="151" width="63" height="31" />
      <rect className={classes.z} x="116" y="98" width="13" height="189" />
      <rect
        className={classes.ai}
        x="129"
        y="98"
        width="20"
        height="189"
        transform="translate(278 385) rotate(180)"
      />
      <rect className={classes.al} x="149" y="98" width="14" height="189" />
      <rect className={classes.r} x="116" y="328" width="47" height="42" />
      <rect
        className={classes.ae}
        x="163"
        y="328"
        width="63"
        height="21"
        transform="translate(389 677) rotate(180)"
      />
      <rect
        className={classes.w}
        x="163"
        y="287"
        width="63"
        height="41"
        transform="translate(389 615) rotate(180)"
      />
      <rect
        className={classes.aa}
        x="163"
        y="349"
        width="63"
        height="21"
        transform="translate(389 719) rotate(180)"
      />
      <rect className={classes.s} x="116" y="370" width="47" height="95" />
      <rect
        className={classes.q}
        x="163"
        y="418"
        width="92"
        height="47"
        transform="translate(418 883) rotate(180)"
      />
      <path className={classes.ai} d="M320,418h-65v47h37.4c9.53,0,18.77-1.21,27.6-3.47v-43.53Z" />
      <rect className={classes.af} x="226" y="386" width="29" height="32" />
      <rect className={classes.y} x="226" y="370" width="29" height="16" />
      <circle className={classes.m} cx="366" cy="179" r="28" />
      <circle className={classes.aj} cx="361" cy="308" r="20" />
      <path
        className={classes.n}
        d="M226,285.86v-67.69c-15.02,3.93-26.1,17.59-26.1,33.84s11.08,29.91,26.1,33.84Z"
      />
      <path
        className={classes.aa}
        d="M163,182v105h45.79c-19.32,0-34.99-15.66-34.99-34.99s15.66-34.99,34.99-34.99h17.21v-35.03h-63Z"
      />
      <path
        className={classes.v}
        d="M272.8,218.17h-46.8v-67.17h94v19.98c0,26.07-21.13,47.2-47.2,47.2Z"
      />
      <path
        className={classes.ak}
        d="M320,157.72v13.26c0,21.13-13.88,39.01-33.03,45.03,3.95,1.62,8.28,2.52,12.81,2.52,18.65,0,33.76-15.12,33.76-33.76,0-11.07-5.32-20.89-13.55-27.05Z"
      />
      <path className={classes.ag} d="M320,151h-20.21c7.58,0,14.58,2.5,20.21,6.72v-6.72Z" />
      <path
        className={classes.ad}
        d="M301.98,285.86h-24.05c23.24,0,42.07,18.84,42.07,42.07h0c0,6.34-1.41,12.36-3.93,17.75,10.36-5.18,17.48-15.88,17.48-28.25h0c0-17.44-14.13-31.57-31.57-31.57Z"
      />
      <path className={classes.ab} d="M320,115.86c-13.46,.4-25.21,7.55-32,18.19v16.95h32v-35.14Z" />
      <path
        className={classes.ah}
        d="M288,98v17h-62v19h62v.05c6.79-10.64,18.54-17.79,32-18.19v-17.86h-32Z"
      />
      <path
        className={classes.o}
        d="M320,89.64c22.57,15.99,48.5,27.53,76.54,33.35-12.28-34-40.99-60.14-76.54-68.86v35.5Z"
      />
      <path className={classes.x} d="M320,98V54.14c-8.35-2.05-17.07-3.14-26.04-3.14h-5.96v47h32Z" />
      <path
        className={classes.l}
        d="M391,343.34v12.06c0,53.81-43.78,97.6-97.6,97.6-3.31,0-6,2.69-6,6s2.69,6,6,6c60.43,0,109.6-49.16,109.6-109.6v-12.06h-12Z"
      />
      <path className={classes.w} d="M320,88.23c-6.24-14.05-17.74-25.23-32-31.06v40.83h32v-9.77Z" />
      <path
        className={classes.p}
        d="M396.53,122.99c-28.03-5.82-53.97-17.36-76.53-33.35v44.36h79.86c-.92-3.75-2.03-7.42-3.33-11.01Z"
      />
    </svg>
  );
};
