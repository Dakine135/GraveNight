<template>
    <div id="app">
        <div id="header" height="200">
            <el-row>
                <el-col :span="4">
                    <!-- <svg id="GNsvg" height="200" width="200">
                        <image
                            xlink:href="@assets/GNHandLogoSVG.svg"
                            src="GNHandLogo512.png"
                            alt="Gravenight Hand Logo SVG"
                            title="GraveNight Hand Logo"
                            width="200"
                            height="200"
                        />
                    </svg> -->
                    <!-- <svg id="GNsvg" height="200" width="200">
                        <image
                            xlink:href="@assets/GNHandLogoSVGTransparent.svg"
                            src="GNHandLogo512.png"
                            alt="Gravenight Hand Logo SVG"
                            title="GraveNight Hand Logo"
                            width="200"
                            height="200"
                        />
                    </svg> -->
                    <svg id="GNsvg" height="200" width="200">
                        <image
                            xlink:href="@assets/GNHandLogoSVGTransparent2.svg"
                            src="GNHandLogo512.png"
                            alt="Gravenight Hand Logo SVG"
                            title="GraveNight Hand Logo"
                            width="200"
                            height="200"
                        />
                    </svg>
                </el-col>
                <el-col :span="18">
                    <div id="nav">
                        <router-link to="/">Home</router-link> | <router-link to="/changelog">Changelog</router-link> |
                        <router-link to="/Game">Game</router-link>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- <svg width="664px" height="584px" viewBox="0 0 664 584" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
                <circle id="path-1" cx="22" cy="22" r="22"></circle>
                <mask id="mask-2" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-1"></use>
                </mask>
                <circle id="path-3" cx="22" cy="22" r="22"></circle>
                <mask id="mask-4" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-3"></use>
                </mask>
                <circle id="path-5" cx="22" cy="22" r="22"></circle>
                <mask id="mask-6" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-5"></use>
                </mask>
                <circle id="path-7" cx="22" cy="22" r="22"></circle>
                <mask id="mask-8" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-7"></use>
                </mask>
                <circle id="path-9" cx="22" cy="22" r="22"></circle>
                <mask id="mask-10" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-9"></use>
                </mask>
                <circle id="path-11" cx="22" cy="22" r="22"></circle>
                <mask id="mask-12" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-11"></use>
                </mask>
                <circle id="path-13" cx="22" cy="22" r="22"></circle>
                <mask id="mask-14" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-13"></use>
                </mask>
                <circle id="path-15" cx="22" cy="22" r="22"></circle>
                <mask id="mask-16" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-15"></use>
                </mask>
                <circle id="path-17" cx="22" cy="22" r="22"></circle>
                <mask id="mask-18" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-17"></use>
                </mask>
                <circle id="path-19" cx="22" cy="22" r="22"></circle>
                <mask id="mask-20" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-19"></use>
                </mask>
                <circle id="path-21" cx="22" cy="22" r="22"></circle>
                <mask id="mask-22" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-21"></use>
                </mask>
                <circle id="path-23" cx="22" cy="22" r="22"></circle>
                <mask id="mask-24" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-23"></use>
                </mask>
                <circle id="path-25" cx="22" cy="22" r="22"></circle>
                <mask id="mask-26" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-25"></use>
                </mask>
                <circle id="path-27" cx="22" cy="22" r="22"></circle>
                <mask id="mask-28" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-27"></use>
                </mask>
                <circle id="path-29" cx="22" cy="22" r="22"></circle>
                <mask id="mask-30" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-29"></use>
                </mask>
                <circle id="path-31" cx="22" cy="22" r="22"></circle>
                <mask id="mask-32" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-31"></use>
                </mask>
                <circle id="path-33" cx="22" cy="22" r="22"></circle>
                <mask id="mask-34" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-33"></use>
                </mask>
                <circle id="path-35" cx="22" cy="22" r="22"></circle>
                <mask id="mask-36" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-35"></use>
                </mask>
                <circle id="path-37" cx="22" cy="22" r="22"></circle>
                <mask id="mask-38" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-37"></use>
                </mask>
                <circle id="path-39" cx="22" cy="22" r="22"></circle>
                <mask id="mask-40" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-39"></use>
                </mask>
                <circle id="path-41" cx="22" cy="22" r="22"></circle>
                <mask id="mask-42" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-41"></use>
                </mask>
                <circle id="path-43" cx="22" cy="22" r="22"></circle>
                <mask id="mask-44" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-43"></use>
                </mask>
                <circle id="path-45" cx="22" cy="22" r="22"></circle>
                <mask id="mask-46" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-45"></use>
                </mask>
                <circle id="path-47" cx="22" cy="22" r="22"></circle>
                <mask id="mask-48" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-47"></use>
                </mask>
                <circle id="path-49" cx="22" cy="22" r="22"></circle>
                <mask id="mask-50" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-49"></use>
                </mask>
                <circle id="path-51" cx="22" cy="22" r="22"></circle>
                <mask id="mask-52" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-51"></use>
                </mask>
                <circle id="path-53" cx="22" cy="22" r="22"></circle>
                <mask id="mask-54" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-53"></use>
                </mask>
                <circle id="path-55" cx="22" cy="22" r="22"></circle>
                <mask id="mask-56" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-55"></use>
                </mask>
                <circle id="path-57" cx="22" cy="22" r="22"></circle>
                <mask id="mask-58" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-57"></use>
                </mask>
                <circle id="path-59" cx="22" cy="22" r="22"></circle>
                <mask id="mask-60" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-59"></use>
                </mask>
                <circle id="path-61" cx="22" cy="22" r="22"></circle>
                <mask id="mask-62" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-61"></use>
                </mask>
                <circle id="path-63" cx="22" cy="22" r="22"></circle>
                <mask id="mask-64" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-63"></use>
                </mask>
                <circle id="path-65" cx="22" cy="22" r="22"></circle>
                <mask id="mask-66" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-65"></use>
                </mask>
                <circle id="path-67" cx="22" cy="22" r="22"></circle>
                <mask id="mask-68" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-67"></use>
                </mask>
                <circle id="path-69" cx="22" cy="22" r="22"></circle>
                <mask id="mask-70" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-69"></use>
                </mask>
                <circle id="path-71" cx="22" cy="22" r="22"></circle>
                <mask id="mask-72" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-71"></use>
                </mask>
                <circle id="path-73" cx="22" cy="22" r="22"></circle>
                <mask id="mask-74" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-73"></use>
                </mask>
                <circle id="path-75" cx="22" cy="22" r="22"></circle>
                <mask id="mask-76" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-75"></use>
                </mask>
                <circle id="path-77" cx="22" cy="22" r="22"></circle>
                <mask id="mask-78" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-77"></use>
                </mask>
                <circle id="path-79" cx="22" cy="22" r="22"></circle>
                <mask id="mask-80" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-79"></use>
                </mask>
                <circle id="path-81" cx="22" cy="22" r="22"></circle>
                <mask id="mask-82" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-81"></use>
                </mask>
                <circle id="path-83" cx="22" cy="22" r="22"></circle>
                <mask id="mask-84" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-83"></use>
                </mask>
                <circle id="path-85" cx="22" cy="22" r="22"></circle>
                <mask id="mask-86" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-85"></use>
                </mask>
                <circle id="path-87" cx="22" cy="22" r="22"></circle>
                <mask id="mask-88" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-87"></use>
                </mask>
                <circle id="path-89" cx="22" cy="22" r="22"></circle>
                <mask id="mask-90" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-89"></use>
                </mask>
                <circle id="path-91" cx="22" cy="22" r="22"></circle>
                <mask id="mask-92" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-91"></use>
                </mask>
                <circle id="path-93" cx="22" cy="22" r="22"></circle>
                <mask id="mask-94" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-93"></use>
                </mask>
                <circle id="path-95" cx="22" cy="22" r="22"></circle>
                <mask id="mask-96" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-95"></use>
                </mask>
                <circle id="path-97" cx="22" cy="22" r="22"></circle>
                <mask id="mask-98" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-97"></use>
                </mask>
                <circle id="path-99" cx="22" cy="22" r="22"></circle>
                <mask id="mask-100" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-99"></use>
                </mask>
                <circle id="path-101" cx="22" cy="22" r="22"></circle>
                <mask id="mask-102" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-101"></use>
                </mask>
                <circle id="path-103" cx="22" cy="22" r="22"></circle>
                <mask id="mask-104" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-103"></use>
                </mask>
                <circle id="path-105" cx="22" cy="22" r="22"></circle>
                <mask id="mask-106" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-105"></use>
                </mask>
                <circle id="path-107" cx="22" cy="22" r="22"></circle>
                <mask id="mask-108" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-107"></use>
                </mask>
                <circle id="path-109" cx="22" cy="22" r="22"></circle>
                <mask id="mask-110" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-109"></use>
                </mask>
                <circle id="path-111" cx="22" cy="22" r="22"></circle>
                <mask id="mask-112" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-111"></use>
                </mask>
                <circle id="path-113" cx="22" cy="22" r="22"></circle>
                <mask id="mask-114" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-113"></use>
                </mask>
                <circle id="path-115" cx="22" cy="22" r="22"></circle>
                <mask id="mask-116" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-115"></use>
                </mask>
                <circle id="path-117" cx="22" cy="22" r="22"></circle>
                <mask id="mask-118" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-117"></use>
                </mask>
                <circle id="path-119" cx="22" cy="22" r="22"></circle>
                <mask id="mask-120" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-119"></use>
                </mask>
                <circle id="path-121" cx="22" cy="22" r="22"></circle>
                <mask id="mask-122" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-121"></use>
                </mask>
                <circle id="path-123" cx="22" cy="22" r="22"></circle>
                <mask id="mask-124" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-123"></use>
                </mask>
                <circle id="path-125" cx="22" cy="22" r="22"></circle>
                <mask id="mask-126" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-125"></use>
                </mask>
                <circle id="path-127" cx="22" cy="22" r="22"></circle>
                <mask id="mask-128" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-127"></use>
                </mask>
                <circle id="path-129" cx="22" cy="22" r="22"></circle>
                <mask id="mask-130" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-129"></use>
                </mask>
                <circle id="path-131" cx="22" cy="22" r="22"></circle>
                <mask id="mask-132" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-131"></use>
                </mask>
                <circle id="path-133" cx="22" cy="22" r="22"></circle>
                <mask id="mask-134" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-133"></use>
                </mask>
                <circle id="path-135" cx="22" cy="22" r="22"></circle>
                <mask id="mask-136" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-135"></use>
                </mask>
                <circle id="path-137" cx="22" cy="22" r="22"></circle>
                <mask id="mask-138" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-137"></use>
                </mask>
                <circle id="path-139" cx="22" cy="22" r="22"></circle>
                <mask id="mask-140" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-139"></use>
                </mask>
                <circle id="path-141" cx="22" cy="22" r="22"></circle>
                <mask id="mask-142" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-141"></use>
                </mask>
                <circle id="path-143" cx="22" cy="22" r="22"></circle>
                <mask id="mask-144" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-143"></use>
                </mask>
                <circle id="path-145" cx="22" cy="22" r="22"></circle>
                <mask id="mask-146" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-145"></use>
                </mask>
                <circle id="path-147" cx="22" cy="22" r="22"></circle>
                <mask id="mask-148" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-147"></use>
                </mask>
                <circle id="path-149" cx="22" cy="22" r="22"></circle>
                <mask id="mask-150" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-149"></use>
                </mask>
                <circle id="path-151" cx="22" cy="22" r="22"></circle>
                <mask id="mask-152" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-151"></use>
                </mask>
                <circle id="path-153" cx="22" cy="22" r="22"></circle>
                <mask id="mask-154" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-153"></use>
                </mask>
                <circle id="path-155" cx="22" cy="22" r="22"></circle>
                <mask id="mask-156" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-155"></use>
                </mask>
                <circle id="path-157" cx="22" cy="22" r="22"></circle>
                <mask id="mask-158" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-157"></use>
                </mask>
                <circle id="path-159" cx="22" cy="22" r="22"></circle>
                <mask id="mask-160" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="44" height="44" fill="white">
                    <use xlink:href="#path-159"></use>
                </mask>
            </defs>
            <g id="Social-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="social-icons">
                    <text id="source" font-family="Helvetica" font-size="13" font-weight="normal" fill="#999999">
                        <tspan x="223.031494" y="557">https://github.com/konsav/social-icons</tspan>
                    </text>
                    <g id="facebook" transform="translate(40.000000, 40.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-2)" stroke-width="4" xlink:href="#path-1"></use>
                        <path
                            d="M23.3147057,35 L18.4372418,35 L18.4372418,23.4985483 L16,23.4985483 L16,19.535534 L18.4372418,19.535534 L18.4372418,17.1562737 C18.4372418,13.9234411 19.8127074,12 23.7230238,12 L26.9776468,12 L26.9776468,15.964466 L24.9435074,15.964466 C23.4212558,15.964466 23.3206665,16.5182719 23.3206665,17.5518493 L23.3139606,19.535534 L27,19.535534 L26.5685836,23.4985483 L23.3139606,23.4985483 L23.3139606,35 L23.3147057,35 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="twitter" transform="translate(100.000000, 40.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-4)" stroke-width="4" xlink:href="#path-3"></use>
                        <path
                            d="M30.526149,16.8457316 C31.4160944,16.2841254 32.0989611,15.3936155 32.41944,14.3328037 C31.5861948,14.8541095 30.6654341,15.2311137 29.6830428,15.4352159 C28.899102,14.5512061 27.7786582,14 26.5386512,14 C24.1597112,14 22.231907,16.0345226 22.231907,18.5435505 C22.231907,18.8997544 22.2676528,19.2468583 22.3416094,19.578362 C18.762106,19.3885599 15.5881317,17.5815398 13.4618771,14.8307092 C13.0908611,15.5041167 12.8788519,16.2841254 12.8788519,17.1161346 C12.8788519,18.6917521 13.6393731,20.0827676 14.7955626,20.8991767 C14.0892763,20.8757764 13.4248987,20.6690741 12.8431062,20.3310703 L12.8431062,20.386971 C12.8431062,22.5891954 14.3271703,24.4261158 16.3005811,24.8421205 C15.9381933,24.9487217 15.558549,25.0020222 15.1641134,25.0020222 C14.8867758,25.0020222 14.6156013,24.9747219 14.3542877,24.9214213 C14.9015672,26.7258414 16.4928685,28.041456 18.3787639,28.0765564 C16.9033281,29.29597 15.0457827,30.021378 13.0279979,30.021378 C12.6804015,30.021378 12.3365029,30.0018778 12,29.9589773 C13.9068498,31.2472916 16.1711569,32 18.6043317,32 C26.5300229,32 30.8614193,25.0761231 30.8614193,19.0713563 C30.8614193,18.8737542 30.858954,18.677452 30.8503258,18.4837498 C31.6921993,17.8428427 32.4243705,17.0420338 33,16.1307237 C32.2271527,16.4921277 31.3963726,16.7365304 30.526149,16.8457316 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="instagram" transform="translate(220.000000, 40.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-8)" stroke-width="4" xlink:href="#path-7"></use>
                        <path
                            d="M21.9999782,12.9820221 C24.9371191,12.9820221 25.2849947,12.9932002 26.4449003,13.0461217 C27.5173894,13.0950697 28.0998311,13.2742691 28.4874851,13.4248682 C29.0008931,13.6244152 29.3673699,13.8628238 29.752273,14.247727 C30.1371762,14.6326301 30.3755848,14.9991069 30.5750882,15.5125149 C30.7257309,15.9001689 30.9049303,16.4826106 30.9538783,17.5550561 C31.0067998,18.7150053 31.0179779,19.0628809 31.0179779,22.0000218 C31.0179779,24.9371627 31.0067998,25.2850383 30.9538783,26.4449439 C30.9049303,27.5174331 30.7257309,28.0998748 30.5750882,28.4875288 C30.3755848,29.0009368 30.1371762,29.3674135 29.752273,29.7523167 C29.3673699,30.1372199 29.0008931,30.3756284 28.4874851,30.5751318 C28.0998311,30.7257746 27.5173894,30.904974 26.4449003,30.953922 C25.2851693,31.0068434 24.9372937,31.0180216 21.9999782,31.0180216 C19.0626626,31.0180216 18.714787,31.0068434 17.5550561,30.953922 C16.4825669,30.904974 15.9001252,30.7257746 15.5125149,30.5751318 C14.9990632,30.3756284 14.6325865,30.1372199 14.2476833,29.7523167 C13.8627801,29.3674135 13.6243716,29.0009368 13.4248682,28.4875288 C13.2742254,28.0998748 13.095026,27.5174331 13.046078,26.4449876 C12.9931566,25.2850383 12.9819784,24.9371627 12.9819784,22.0000218 C12.9819784,19.0628809 12.9931566,18.7150053 13.046078,17.5550997 C13.095026,16.4826106 13.2742254,15.9001689 13.4248682,15.5125149 C13.6243716,14.9991069 13.8627801,14.6326301 14.2476833,14.247727 C14.6325865,13.8628238 14.9990632,13.6244152 15.5125149,13.4248682 C15.9001252,13.2742691 16.4825669,13.0950697 17.5550124,13.0461217 C18.7149617,12.9932002 19.0628373,12.9820221 21.9999782,12.9820221 M21.9999782,11 C19.0125357,11 18.637981,11.0126627 17.4647141,11.0661955 C16.2938487,11.1196409 15.4942631,11.3055647 14.7945384,11.5775076 C14.0711911,11.8586201 13.4577476,12.2347467 12.8462253,12.846269 C12.234703,13.4577912 11.8585764,14.0712348 11.5774639,14.794582 C11.305521,15.4943067 11.1195973,16.2938923 11.0661518,17.4647577 C11.0126191,18.637981 11,19.0125794 11,22.0000218 C11,24.9874643 11.0126191,25.3620626 11.0661518,26.5352859 C11.1195973,27.7061513 11.305521,28.5057369 11.5774639,29.2054616 C11.8585764,29.9287652 12.234703,30.5422524 12.8462253,31.1537747 C13.4577476,31.765297 14.0711911,32.1414236 14.7945384,32.4225361 C15.4942631,32.694479 16.2938487,32.8804027 17.4647141,32.9338482 C18.637981,32.9873809 19.0125357,33 21.9999782,33 C24.9874206,33 25.362019,32.9873809 26.5352423,32.9338482 C27.7061077,32.8804027 28.5056933,32.694479 29.205418,32.4225361 C29.9287652,32.1414236 30.5422088,31.765297 31.153731,31.1537747 C31.7652533,30.5422524 32.1413799,29.9288089 32.4224924,29.2054616 C32.6944353,28.5057369 32.8803591,27.7061513 32.9338045,26.5352859 C32.9873373,25.3620626 33,24.9874643 33,22.0000218 C33,19.0125794 32.9873373,18.637981 32.9338045,17.4647577 C32.8803591,16.2938923 32.6944353,15.4943067 32.4224924,14.794582 C32.1413799,14.0712348 31.7652533,13.4577912 31.153731,12.846269 C30.5422088,12.2347467 29.9287652,11.8586201 29.205418,11.5775076 C28.5056933,11.3055647 27.7061077,11.1196409 26.5352423,11.0661955 C25.362019,11.0126627 24.9874206,11 21.9999782,11 Z M22.0218254,16.3690476 C18.8998963,16.3690476 16.3690476,18.8998963 16.3690476,22.0218254 C16.3690476,25.1437545 18.8998963,27.6746032 22.0218254,27.6746032 C25.1437545,27.6746032 27.6746032,25.1437545 27.6746032,22.0218254 C27.6746032,18.8998963 25.1437545,16.3690476 22.0218254,16.3690476 Z M22.0218254,25.6911823 C19.99532,25.6911823 18.3524685,24.0483308 18.3524685,22.0218254 C18.3524685,19.99532 19.99532,18.3524685 22.0218254,18.3524685 C24.0483308,18.3524685 25.6911823,19.99532 25.6911823,22.0218254 C25.6911823,24.0483308 24.0483308,25.6911823 22.0218254,25.6911823 Z M29.1587302,16.1071212 C29.1587302,16.830358 28.5724648,17.4166667 27.849228,17.4166667 C27.1259912,17.4166667 26.5396825,16.830358 26.5396825,16.1071212 C26.5396825,15.3838844 27.1259912,14.797619 27.849228,14.797619 C28.5724648,14.797619 29.1587302,15.3838844 29.1587302,16.1071212 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>

                    <g id="youtube" transform="translate(40.000000, 100.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-24)" stroke-width="4" xlink:href="#path-23"></use>
                        <path
                            d="M15.9255115,28.0171834 L15.942126,23.9659484 L16.6992744,23.9580095 L17.4556316,23.9484828 L17.4469287,23.324483 L17.4374347,22.6996894 L15.252227,22.6909565 L13.0686016,22.6822237 L13.0686016,23.3157502 L13.0686016,23.9484828 L13.8075531,23.9580095 L14.5465045,23.9659484 L14.5552074,27.9838399 C14.5591632,30.1932436 14.5702396,32.0207849 14.5789425,32.0438078 C14.59081,32.0763574 14.7442967,32.0842963 15.2514358,32.0771513 L15.9088969,32.0684185 L15.9255115,28.0171834 Z M28.5296188,27.7321759 C28.4987632,27.6511988 28.5414863,26.7151992 28.5826271,26.5794435 C28.6783585,26.2602986 28.8816888,26.1046956 29.2021121,26.1046956 C29.4687359,26.1046956 29.638046,26.2079017 29.7519743,26.4397184 C29.8239706,26.5865886 29.8310912,26.6493061 29.8421675,27.1923288 L29.8532439,27.7837789 L29.2005298,27.7837789 C28.6395912,27.7837789 28.5462333,27.7766339 28.5296188,27.7321759 L28.5296188,27.7321759 Z M29.7480185,32.0969986 C30.3872827,31.9167849 30.829546,31.4785561 30.9964825,30.8601136 C31.0241734,30.7545259 31.0566114,30.4536405 31.0676877,30.1924497 L31.0866758,29.7177018 L30.4711466,29.7177018 L29.8548262,29.7177018 L29.839794,30.1432284 C29.8223883,30.6267091 29.7725447,30.7926327 29.5969052,30.9474418 C29.4101895,31.1117776 29.0668223,31.123686 28.8437127,30.9728464 C28.5778801,30.7926327 28.5122131,30.4885718 28.5256629,29.5009691 L28.535157,28.8007556 L29.8097296,28.7928167 L31.0843023,28.78329 L31.0676877,27.7417026 C31.0471173,26.5794435 31.0233823,26.4031993 30.8287548,25.9903751 C30.4576967,25.2083907 29.4299687,24.8138259 28.5762977,25.1258258 C27.9322865,25.361612 27.5517344,25.7863446 27.3990388,26.4436879 C27.3452393,26.6755046 27.33891,26.8835045 27.33891,28.5840229 C27.33891,30.6695793 27.3460305,30.7545259 27.5580637,31.1816402 C27.9370335,31.9413956 28.8856447,32.338342 29.7480185,32.0969986 L29.7480185,32.0969986 Z M24.7011538,30.909335 C24.7794795,30.8561441 24.8309055,30.7823121 24.8712551,30.6671976 C24.922681,30.5155641 24.927428,30.3226482 24.9203075,28.5340077 C24.913187,26.6699473 24.9092312,26.5603901 24.8491023,26.4381306 C24.6948245,26.1261307 24.3063607,26.0959628 23.9503348,26.3690619 L23.8332418,26.4579779 L23.8332418,28.5840229 L23.8332418,30.7100679 L23.9495436,30.7989839 C24.2130028,31.0006326 24.5017793,31.0427089 24.7011538,30.909335 L24.7011538,30.909335 Z M25.4725432,32.1097009 C25.6663795,32.0533345 25.9005654,31.8223117 26.0057909,31.5865255 C26.20833,31.1348005 26.2091212,31.123686 26.2091212,28.5840229 C26.2091212,26.4992604 26.2027919,26.2420391 26.1513659,26.0165735 C25.9844293,25.294925 25.6204918,24.9797495 25.0081272,25.0257953 C24.6655512,25.0527877 24.3957627,25.1893372 24.0721748,25.5029249 C23.9313467,25.6386806 23.8055509,25.7506194 23.7913099,25.7506194 C23.7786512,25.7506194 23.7667837,25.0599327 23.7667837,24.2168185 L23.7667837,22.6830176 L23.1686602,22.6830176 L22.5705367,22.6830176 L22.5705367,27.383657 L22.5705367,32.0850902 L23.1686602,32.0850902 L23.7667837,32.0850902 L23.7667837,31.768327 C23.7667837,31.5579454 23.7794424,31.4515637 23.8039686,31.4515637 C23.8237478,31.4515637 23.9582465,31.5627087 24.1030303,31.6992583 C24.5682375,32.138281 24.9709423,32.2589527 25.4725432,32.1097009 L25.4725432,32.1097009 Z M19.1060093,32.0787391 C19.3449422,31.9898231 19.6258071,31.7945254 19.8623665,31.553182 C19.9707566,31.442037 20.0791467,31.3515333 20.1028818,31.3515333 C20.1345285,31.3515333 20.1456049,31.442037 20.1456049,31.7183117 L20.1456049,32.0850902 L20.7437284,32.0850902 L21.3418518,32.0850902 L21.3418518,28.6006946 L21.3418518,25.117093 L20.7437284,25.117093 L20.1456049,25.117093 L20.1456049,27.8044202 L20.1456049,30.4925412 L19.8876839,30.7489686 C19.6835624,30.9529991 19.5981162,31.0149227 19.4715292,31.049854 C19.2579137,31.1093959 19.1218327,31.0681135 19.034013,30.91648 C18.9675548,30.8037472 18.9659725,30.7513503 18.9564784,27.9592293 L18.9477756,25.117093 L18.3496521,25.117093 L17.753111,25.117093 L17.753111,28.1346796 C17.753111,31.4221897 17.7562756,31.4936401 17.9398268,31.8104033 C18.1407836,32.1565406 18.6107378,32.2653039 19.1060093,32.0787391 L19.1060093,32.0787391 Z M19.6139396,34.9859746 C18.837012,34.9724784 17.917674,34.9510433 17.570351,34.938341 C15.2387771,34.8541884 13.638243,34.7644785 13.3186108,34.6993793 C12.8628977,34.6072877 12.3533851,34.2976695 12.0574881,33.9332727 C11.5843692,33.3497615 11.3311953,32.6416091 11.2085641,31.5515942 C10.9245346,29.0174884 10.9308639,26.0618254 11.2259698,23.6166356 C11.3557215,22.5448803 11.6777271,21.7708348 12.2180953,21.2309876 C12.5266511,20.9221633 12.8233393,20.7506825 13.2181324,20.6490642 C14.0741769,20.4291559 20.7722104,20.2544995 24.8467288,20.3450033 C27.2004555,20.3974002 29.7432714,20.5069574 30.4189294,20.583965 C31.2931708,20.6839955 31.9071176,21.1381022 32.3319752,21.9994759 C32.6531896,22.6496741 32.7552504,23.1561777 32.8857932,24.716971 C32.987854,25.9522682 33.0131714,26.7223442 32.9941833,28.1489696 C32.9728218,29.8558392 32.8644317,31.3594722 32.7022421,32.2033802 C32.5313497,33.0957158 32.1278537,33.8562651 31.6048912,34.2682955 C31.2021864,34.5866465 30.7725818,34.7287533 30.0961326,34.7668601 C29.8951758,34.7787685 29.6412107,34.7946464 29.5312383,34.8033792 C29.1419833,34.8335471 27.0548805,34.9176998 25.9100595,34.9502494 C24.2090469,34.997883 21.2326706,35.0145547 19.6139396,34.9859746 Z M17.5148799,19.500828 C17.4863978,19.4539883 17.4911449,16.7110887 17.5196269,16.3228751 C17.5568118,15.8251043 17.472948,15.4329212 17.1169221,14.4310285 C17.0014115,14.1063263 16.792543,13.4759754 16.6532973,13.0313955 C15.6461396,9.81692346 15.6991479,10.0050761 15.7956705,10.0042822 C16.459461,9.99872491 17.2783205,10.0026944 17.2878145,10.0122211 C17.2941439,10.0185722 17.5093417,10.8029383 17.7664715,11.7564036 C18.0243925,12.709075 18.2387992,13.5021739 18.2443374,13.5196395 C18.2490844,13.5355174 18.4001976,12.9805863 18.5797929,12.2859301 C18.955598,10.8283429 19.16684,10.0241295 19.1747517,10.0169844 C19.1913662,10.0011066 19.378082,9.99793102 19.9896554,10.0011066 L20.6661045,10.0050761 L20.6510723,10.1138394 C20.6392048,10.2019615 20.1771623,11.7579914 19.6937583,13.338632 C19.6415412,13.5132884 19.5062513,13.9634256 19.3946966,14.3397308 C19.2831418,14.7152421 19.1486431,15.1614099 19.0948436,15.3313029 L18.9975299,15.6409211 L18.9975299,17.5716685 C18.9975299,19.382538 18.9935741,19.5040036 18.9397746,19.5182937 C18.8179346,19.5516372 17.5362415,19.5357593 17.5148799,19.500828 Z M26.2572932,19.6167364 C25.92342,19.5722784 25.7280014,19.4428738 25.5942939,19.1769197 C25.4265661,18.8434848 25.4265661,18.8450725 25.4265661,15.5226311 L25.4265661,12.4224797 L26.1006418,12.4224797 L26.7739263,12.4224797 L26.7881673,15.2804938 C26.8031995,18.3846147 26.7992437,18.3123705 26.9843772,18.3592101 C27.1544784,18.4012865 27.3427765,18.3099888 27.5769625,18.0702332 L27.8016543,17.8407981 L27.8103572,15.131242 L27.8182689,12.4224797 L28.4915534,12.412953 L29.1648379,12.405014 L29.1648379,15.952921 L29.1648379,19.5016219 L29.0730623,19.5206753 C28.9630899,19.5436982 27.9424824,19.5421104 27.8602008,19.5182937 C27.8103572,19.5047975 27.8024455,19.4587517 27.8024455,19.1808892 L27.8024455,18.8585687 L27.6109827,19.0459274 C27.1710929,19.4754234 26.6963918,19.6754844 26.2572932,19.6167364 L26.2572932,19.6167364 Z M22.8647621,18.2615613 C23.0957834,18.0853171 23.0973657,18.0702332 23.1092332,16.0751805 C23.1195184,14.5247078 23.1139803,14.2611354 23.0673013,14.0499599 C23.0040078,13.7641585 22.8932442,13.6291968 22.676464,13.5696548 C22.3963903,13.4950289 22.1400517,13.6553952 22.0498585,13.9626317 C21.981818,14.1992118 21.9826091,17.716157 22.0514408,17.952737 C22.1036579,18.130569 22.2705945,18.3250728 22.3940168,18.3520651 C22.554624,18.3862025 22.751625,18.3480956 22.8655533,18.2615613 L22.8647621,18.2615613 Z M22.3370527,19.6151486 C21.7341822,19.5421104 21.1803641,19.1864465 20.9137403,18.7005841 C20.6423695,18.2059888 20.6170521,17.9471798 20.6328755,15.7687379 C20.6455341,14.0817157 20.6502812,13.9761279 20.7167393,13.7339906 C20.8757642,13.1584183 21.1835288,12.7662353 21.6606035,12.5288613 C22.3156911,12.2041592 23.0222047,12.2462355 23.6401074,12.6479452 C24.0341094,12.9027848 24.2730423,13.2727389 24.4012116,13.8229066 C24.4573846,14.0658378 24.4629228,14.2524026 24.4629228,15.9560966 C24.4629228,18.0281568 24.4534287,18.1480347 24.2413955,18.5965841 C24.0380652,19.0292557 23.5776051,19.4103242 23.0973657,19.5444921 C22.8853325,19.6024463 22.5174391,19.6373776 22.3370527,19.6151486 L22.3370527,19.6151486 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="youtube-play" transform="translate(100.000000, 100.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-26)" stroke-width="4" xlink:href="#path-25"></use>
                        <path
                            d="M32,25.5641799 L32,18.4358201 C32,18.4358201 32,15 28.5533866,15 L15.4454374,15 C15.4454374,15 12,15 12,18.4358201 L12,25.5641799 C12,25.5641799 12,29 15.4454374,29 L28.5533866,29 C28.5533866,29 32,29 32,25.5641799 M25.8828786,22.009964 L19.3353716,25.8431717 L19.3353716,18.175584 L25.8828786,22.009964"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>

                    <g id="medium" transform="translate(280.000000, 100.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-30)" stroke-width="4" xlink:href="#path-29"></use>
                        <path
                            d="M32.9327307,16.4069792 C32.9285264,16.4036157 32.9251629,16.3992012 32.9199075,16.3966786 L32.9123397,16.3928947 L26.2758041,13.0746269 C26.231028,13.0521337 26.1839395,13.0369981 26.1362203,13.0248055 C26.0763086,13.0094597 26.0151356,13 25.9537524,13 C25.6996006,13 25.4467101,13.1276014 25.3096489,13.3500105 L21.4889636,19.5589657 L26.2837923,27.3504309 L32.9531217,16.5129283 C32.9751945,16.4767711 32.9646836,16.4322052 32.9327307,16.4069792 Z M19.384486,18.144629 L19.384486,25.2123187 L25.6665966,28.353374 L19.384486,18.144629 Z M26.6104688,28.8253101 L31.781585,31.4107631 C32.4544881,31.7473197 33,31.511667 33,30.8848013 L33,18.4422956 L26.6104688,28.8253101 Z M18.2938827,16.4170696 L11.8122766,13.1761614 C11.695186,13.1177213 11.5837713,13.0899727 11.4828674,13.0899727 C11.199075,13.0899727 11,13.3096489 11,13.6781585 L11,27.6722724 C11,28.0468783 11.2741223,28.4904351 11.6092075,28.6579777 L17.3180576,31.5122977 C17.4643683,31.585453 17.6037419,31.6201387 17.7296616,31.6201387 C18.084507,31.6201387 18.3334034,31.345596 18.3334034,30.8848013 L18.3334034,16.4807652 C18.3334034,16.4538575 18.3180576,16.4290519 18.2938827,16.4170696 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>

                    <g id="tumblr" transform="translate(400.000000, 100.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-34)" stroke-width="4" xlink:href="#path-33"></use>
                        <path
                            d="M22.4823636,11 L22.4823636,16.2531111 L27.6178182,16.2531111 L27.6178182,19.5164444 L22.4823636,19.5164444 L22.4823636,24.8465556 C22.4823636,26.0528889 22.5485455,26.8265556 22.6809091,27.1663333 C22.8132727,27.511 23.0601818,27.7835556 23.4241818,27.9876667 C23.9014545,28.2638889 24.4487273,28.4007778 25.066,28.4007778 C26.1618182,28.4007778 27.2512727,28.0573333 28.3356364,27.3741111 L28.3356364,30.6545556 C27.4103636,31.0701111 26.5741818,31.3646667 25.8245455,31.5333333 C25.0736364,31.7032222 24.2629091,31.7863333 23.3923636,31.7863333 C22.4009091,31.7863333 21.5265455,31.6665556 20.7667273,31.427 C20.0069091,31.185 19.3578182,30.8452222 18.822,30.4003333 C18.2849091,29.9566667 17.9107273,29.4824444 17.7045455,28.9825556 C17.4970909,28.4826667 17.394,27.7578889 17.394,26.807 L17.394,19.5164444 L15,19.5164444 L15,16.5745556 C15.8527273,16.3093333 16.5794545,15.928 17.1865455,15.4342222 C17.7910909,14.9392222 18.2798182,14.344 18.6450909,13.6485556 C19.0116364,12.9555556 19.2649091,12.0718889 19.4036364,11 L22.4823636,11"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>

                    <g id="rss" transform="translate(580.000000, 100.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-40)" stroke-width="4" xlink:href="#path-39"></use>
                        <path
                            d="M13.0078198,12 L13.0078198,15.6261759 C21.4744826,15.6317615 28.3559501,22.5255174 28.36377,31 L32,31 C31.9977658,25.7629351 29.8685325,21.0174036 26.4277987,17.5744356 C22.9870649,14.1325847 18.2437676,12.0022342 13.0078198,12 L13.0078198,12 Z M13.0022342,18.4614299 L13.0022342,22.088723 C15.3694144,22.0898401 17.611477,23.0204022 19.2860419,24.6994356 C20.9639581,26.3740005 21.8889346,28.6171802 21.8934031,30.9932973 L21.8934031,31 L25.5385701,31 C25.5352187,27.5436265 24.1298801,24.4134525 21.8587723,22.1412277 C19.5876646,19.8690028 16.4574906,18.462547 13.0022342,18.4614299 L13.0022342,18.4614299 Z M13.7395343,30.2403575 L13.7395343,30.2392404 L13.7384172,30.2392404 L13.7395343,30.2403575 L13.7395343,30.2403575 Z M17.3053857,26.6867944 C17.7667568,27.1470484 18.0471543,27.7704022 18.0482714,28.4652516 C18.0471543,29.1578669 17.7667568,29.7823377 17.3076199,30.2392404 L17.3053857,30.2403575 C16.8473659,30.6972601 16.2195437,30.9776576 15.52246,30.9776576 C14.8242592,30.9776576 14.1986712,30.696143 13.7395343,30.2392404 C13.2826317,29.7823377 13,29.158984 13,28.4652516 C13,27.7704022 13.2826317,27.1459313 13.7395343,26.6867944 C14.1986712,26.2298918 14.8242592,25.9472601 15.52246,25.9472601 C16.2195437,25.9472601 16.8473659,26.2298918 17.3053857,26.6867944 L17.3053857,26.6867944 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>

                    <g id="mail" transform="translate(160.000000, 160.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-46)" stroke-width="4" xlink:href="#path-45"></use>
                        <path
                            d="M13.1115479,18.9319176 C13.389863,19.1136566 14.228726,19.6535732 15.6282877,20.5512492 C17.0278493,21.4489252 18.0999726,22.1401747 18.8448082,22.6248583 C18.9266301,22.6779992 19.1005205,22.7934864 19.3664795,22.9714595 C19.6324384,23.149572 19.8534932,23.293652 20.0293425,23.4034207 C20.2053425,23.5131893 20.4181096,23.6363478 20.6677945,23.7726171 C20.9174795,23.9088864 21.1528493,24.0112628 21.3737534,24.0791882 C21.5948082,24.1475321 21.7994384,24.1814251 21.9876438,24.1814251 L22,24.1814251 L22.0123562,24.1814251 C22.2005616,24.1814251 22.4051918,24.1475321 22.6262466,24.0791882 C22.8471507,24.0112628 23.0826712,23.908747 23.3322055,23.7726171 C23.5817397,23.6362083 23.7945068,23.5131893 23.9705068,23.4034207 C24.1465068,23.293652 24.367411,23.149572 24.6333699,22.9714595 C24.8993288,22.7933469 25.0733699,22.6779992 25.1551918,22.6248583 C25.9080137,22.1400352 27.8233699,20.9090085 30.9006575,18.9316387 C31.4981233,18.545426 31.9971918,18.0794323 32.3983151,17.5339366 C32.799589,16.9887198 33,16.4167233 33,15.8182262 C33,15.3182 32.8054658,14.8901442 32.4166986,14.5340586 C32.0279315,14.177973 31.5674384,14 31.0356712,14 L12.9641781,14 C12.3340137,14 11.8491096,14.196942 11.5094658,14.5908259 C11.1698219,14.9848493 11,15.4773437 11,16.0681695 C11,16.5454609 11.2251233,17.0626427 11.6752192,17.6194362 C12.1253151,18.1762296 12.6041918,18.6137699 13.1115479,18.9319176 Z M31.7722192,20.1477413 C29.0879178,21.8294193 27.0497534,23.1363216 25.6586301,24.0681695 C25.1921096,24.3863173 24.813589,24.6345869 24.5229178,24.8124205 C24.2323973,24.990533 23.8457397,25.1722719 23.3627945,25.3579162 C22.88,25.5435605 22.4299041,25.6363129 22.0125068,25.6363129 L22,25.6363129 L21.9876438,25.6363129 C21.5702466,25.6363129 21.12,25.5435605 20.6372055,25.3579162 C20.154411,25.1722719 19.7676027,24.990533 19.4770822,24.8124205 C19.1865616,24.6345869 18.8080411,24.3863173 18.3415205,24.0681695 C17.2365479,23.3182 15.2027534,22.0112977 12.2399863,20.1477413 C11.7734658,19.8599997 11.360137,19.5302753 11,19.1591262 L11,28.1816343 C11,28.6818 11.192274,29.1097163 11.5769726,29.4658019 C11.9616712,29.822027 12.4241233,30 12.9643288,30 L31.0358219,30 C31.5758767,30 32.0383288,29.822027 32.4230274,29.4658019 C32.8078767,29.1095769 33,28.6818 33,28.1816343 L33,19.1591262 C32.648,19.522604 32.2388904,19.8523284 31.7722192,20.1477413 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="send" transform="translate(220.000000, 160.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-48)" stroke-width="4" xlink:href="#path-47"></use>
                        <path
                            d="M30.9886676,11.9209704 L27.8458705,30.7777533 C27.8049484,31.0151012 27.6739999,31.1992476 27.4530208,31.3301981 C27.3384391,31.3956734 27.2115827,31.4284106 27.0724477,31.4284106 C26.9824192,31.4284106 26.8842078,31.4079498 26.7778105,31.3670278 L21.2165327,29.0958658 L18.2456073,32.7174485 C18.0982879,32.9056899 17.8977729,32.9998091 17.6440563,32.9998091 C17.537659,32.9998091 17.4476318,32.9834406 17.3739721,32.9507029 C17.2184684,32.8934121 17.093658,32.7972467 16.9995373,32.662204 C16.9054166,32.5271612 16.858357,32.377798 16.858357,32.2141098 L16.858357,27.9295934 L27.4652974,14.9287255 L14.3416639,26.2845355 L9.49242614,24.2957342 C9.18960303,24.1811525 9.02591731,23.9560846 9.00136409,23.6205239 C8.98499527,23.2931475 9.11594384,23.0517111 9.39421373,22.8962073 L29.8223953,11.110718 C29.9451614,11.0370583 30.07611,11.000229 30.2152449,11.000229 C30.3789331,11.000229 30.5262502,11.0452426 30.6572007,11.1352711 C30.9272862,11.3316969 31.0377741,11.593594 30.9886676,11.9209704 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="send-light" transform="translate(280.000000, 160.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-50)" stroke-width="4" xlink:href="#path-49"></use>
                        <path
                            d="M30.6562954,11.1475816 C30.9263504,11.3439852 31.0368257,11.6058527 30.9877248,11.9331921 L27.845283,30.7878429 C27.8043656,31.0251639 27.6734318,31.2092895 27.4524778,31.3402253 C27.337909,31.4056931 27.2110669,31.4384266 27.0719477,31.4384266 C26.9819294,31.4384266 26.8837291,31.4179682 26.7773438,31.3770508 L20.3083327,28.7378907 L16.6503341,32.7518691 C16.5030314,32.9237222 16.3107224,33.0096475 16.0734014,33.0096475 C15.9588326,33.0096475 15.864724,32.9932808 15.7910726,32.9605468 C15.6355865,32.9032625 15.5128361,32.807108 15.4228177,32.6720805 C15.3327994,32.537053 15.2877909,32.3877067 15.2877909,32.224037 L15.2877909,26.6756632 L9.49391386,24.3065567 C9.19112498,24.1919879 9.02745777,23.9669455 9.00290732,23.6314227 C8.97835688,23.3122669 9.10929064,23.0708577 9.39571255,22.9071881 L29.8215843,11.1230313 C30.1080062,10.9511781 30.3862405,10.9593615 30.6562954,11.1475816 L30.6562954,11.1475816 Z M26.4581896,29.5480514 L29.1710007,13.3080104 L11.5684165,23.4595704 L15.6928713,25.1412678 L26.2863373,17.2974384 L20.4188092,27.0807436 L26.4581896,29.5480514 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>

                    <g id="behance" transform="translate(160.000000, 220.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-66)" stroke-width="4" xlink:href="#path-65"></use>
                        <path
                            d="M21.6360265,16.4555815 C22.0312615,17.0375525 22.2301218,17.7306866 22.2301218,18.5402149 C22.2301218,19.3732835 22.0312615,20.044185 21.631055,20.5503036 C21.4048514,20.8340962 21.0754889,21.0943484 20.6392391,21.3284447 C21.3016926,21.5834657 21.8000863,21.9849603 22.1393918,22.5342363 C22.4762115,23.0822046 22.6439999,23.7504904 22.6439999,24.5351705 C22.6439999,25.3433909 22.4525968,26.0705278 22.066062,26.7113498 C21.8212152,27.1363849 21.5142246,27.4960299 21.1475758,27.7863615 C20.7336977,28.1198505 20.2464899,28.3474078 19.6822237,28.4716488 C19.1179574,28.5958898 18.5077048,28.6560486 17.847737,28.6560486 L12,28.6560486 L12,15 L18.2715581,15 C19.8549836,15.026156 20.9748159,15.510042 21.6360265,16.4555815 L21.6360265,16.4555815 Z M14.5876702,17.3723494 L14.5876702,20.3855208 L17.7433353,20.3855208 C18.3051158,20.3855208 18.7637375,20.2717422 19.1167146,20.0454928 C19.465963,19.8205511 19.6436945,19.4203643 19.6436945,18.8475479 C19.6436945,18.2106492 19.4112764,17.7908454 18.9464404,17.5855208 C18.5449911,17.4442784 18.0341686,17.3723494 17.41273,17.3723494 L14.5876702,17.3723494 L14.5876702,17.3723494 Z M14.5876702,22.6440915 L14.5876702,26.285007 L17.7383638,26.285007 C18.3013872,26.285007 18.7401228,26.2052312 19.0533278,26.0456796 C19.6225656,25.7475012 19.9059416,25.1799159 19.9059416,24.3416161 C19.9059416,23.628865 19.6325086,23.1423634 19.0806711,22.8755722 C18.7711947,22.7277908 18.3386735,22.6493227 17.7831074,22.6440915 L14.5876702,22.6440915 L14.5876702,22.6440915 Z M30.4902834,18.7638487 C31.161437,19.0790285 31.7132745,19.5773003 32.1470386,20.2573564 C32.5435164,20.8576366 32.7983062,21.5533863 32.9138938,22.3446053 C32.9810092,22.8088744 33.0095953,23.4771602 32.9971666,24.3494629 L26.0059826,24.3494629 C26.0469975,25.3630079 26.3788457,26.0731434 27.0102273,26.4798692 C27.3942764,26.7335824 27.8553838,26.8591312 28.3947925,26.8591312 C28.9640302,26.8591312 29.4301092,26.7061186 29.7868149,26.3974778 C29.9831895,26.2300794 30.1547065,25.9985988 30.3038518,25.7017282 L32.8654216,25.7017282 C32.7983062,26.3007006 32.4875869,26.9088277 31.9357495,27.5287249 C31.0769214,28.509575 29.8725734,29 28.3264342,29 C27.0487565,29 25.9202241,28.5867352 24.9470513,27.7575899 C23.9676641,26.9297525 23.4816991,25.5814106 23.4816991,23.7164876 C23.4816991,21.9653433 23.9216776,20.6248482 24.8016346,19.6897711 C25.6840774,18.7586175 26.8275244,18.290425 28.2332185,18.290425 C29.0684319,18.290425 29.8216155,18.447361 30.4902834,18.7638487 L30.4902834,18.7638487 Z M26.7367944,21.044652 C26.3825744,21.4291453 26.1588565,21.9509575 26.0681265,22.6074731 L30.3920961,22.6074731 C30.3473525,21.9064923 30.1223917,21.3755255 29.724671,21.011957 C29.3219788,20.6496964 28.8260709,20.4679122 28.2344613,20.4679122 C27.5918938,20.4679122 27.0910144,20.6601588 26.7367944,21.044652 L26.7367944,21.044652 Z M25.4193446,17.3370388 L30.979977,17.3370388 L30.979977,15.6382064 L25.4193446,15.6382064 L25.4193446,17.3370388 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="dribbble" transform="translate(220.000000, 220.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-68)" stroke-width="4" xlink:href="#path-67"></use>
                        <path
                            d="M32.7762098,19.7862896 C32.6326219,19.0787818 32.4152996,18.3829149 32.1345916,17.7180904 C31.8603516,17.0662002 31.5175516,16.4375919 31.120421,15.8503733 C30.7271712,15.2683285 30.27571,14.719913 29.7789734,14.2232348 C29.2809431,13.7252631 28.7337567,13.273855 28.1503499,12.8806514 C27.5630623,12.4822741 26.93438,12.1421012 26.2824131,11.8653066 C25.6175104,11.5859251 24.9215617,11.3673349 24.2152643,11.2250573 C23.4908567,11.0763125 22.7457517,11 22.0006468,11 C21.2542483,11 20.5091433,11.0763125 19.7847357,11.2250573 C19.0784383,11.3673349 18.3824896,11.5859251 17.7175869,11.8653066 C17.06562,12.1421012 16.4369377,12.4822741 15.8483566,12.8806514 C15.2662433,13.273855 14.7190569,13.7252631 14.2210266,14.2232348 C13.7229964,14.719913 13.2728288,15.2683285 12.879579,15.8503733 C12.4811548,16.4375919 12.1396484,17.0662002 11.8641148,17.7180904 C11.5834068,18.3829149 11.3673781,19.0787818 11.2224966,19.7862896 C11.0750279,20.5080252 11,21.2543359 11,21.9993533 C11,22.7456641 11.0750279,23.4919748 11.2224966,24.2162973 C11.3673781,24.9212182 11.5834068,25.6183785 11.8641148,26.2819096 C12.1396484,26.9337998 12.4811548,27.5637016 12.879579,28.1522135 C13.2728288,28.7342583 13.7229964,29.280087 14.2210266,29.7780587 C14.7190569,30.2760303 15.2662433,30.726145 15.8483566,31.1193486 C16.4369377,31.5177259 17.06562,31.8591922 17.7175869,32.1346934 C18.3824896,32.4153683 19.0784383,32.6300782 19.7847357,32.7749427 C20.5091433,32.9249809 21.2542483,33 22.0006468,33 C22.7457517,33 23.4908567,32.9249809 24.2152643,32.7749427 C24.9215617,32.6300782 25.6175104,32.4153683 26.2824131,32.1346934 C26.93438,31.8591922 27.5630623,31.5177259 28.1503499,31.1193486 C28.7337567,30.726145 29.2809431,30.2760303 29.7789734,29.7780587 C30.27571,29.280087 30.7271712,28.7342583 31.120421,28.1522135 C31.5175516,27.5637016 31.8603516,26.9337998 32.1345916,26.2819096 C32.4152996,25.6183785 32.6326219,24.9212182 32.7762098,24.2162973 C32.9249721,23.4919748 33,22.7456641 33,21.9993533 C33,21.2543359 32.9249721,20.5080252 32.7762098,19.7862896 L32.7762098,19.7862896 Z M31.3920739,21.9062261 C31.2562474,21.8764772 28.0766155,21.1922512 24.849121,21.5983891 C24.7818545,21.4380034 24.7145881,21.2763243 24.6460281,21.1146452 C24.4494032,20.6541831 24.2398424,20.1988947 24.0212266,19.7513669 C27.7312283,18.236757 29.2369613,16.058616 29.2550714,16.0327474 C30.571941,17.6340173 31.3700829,19.6776412 31.3920739,21.9062261 L31.3920739,21.9062261 Z M28.2046804,14.950144 C28.1813959,14.9863602 26.843829,17.023517 23.296819,18.3518725 C21.69148,15.4015521 19.92703,13.0578517 19.7860293,12.8715974 C20.4962074,12.6995708 21.2374316,12.6064436 22.0006468,12.6064436 C24.378256,12.6064436 26.5488916,13.4937386 28.2046804,14.950144 L28.2046804,14.950144 Z M19.7498089,12.879358 C19.7498089,12.8806514 19.7485153,12.8806514 19.7485153,12.8806514 C19.7485153,12.8806514 19.7368731,12.8832383 19.7200564,12.8871186 C19.7291115,12.8845317 19.7394602,12.8832383 19.7498089,12.879358 L19.7498089,12.879358 Z M17.9918269,13.5040861 C18.1160111,13.6722323 19.8545893,16.0262802 21.4806256,18.9171027 C16.9698947,20.116115 13.054213,20.068258 12.8058447,20.0643777 C13.4164168,17.1541537 15.3710237,14.7419013 17.9918269,13.5040861 L17.9918269,13.5040861 Z M12.605339,21.9993533 C12.605339,21.899759 12.6105133,21.8014581 12.6131005,21.7031572 C12.7786794,21.7070375 17.4213559,21.8118055 22.2580702,20.3644541 C22.5271359,20.8908813 22.7845593,21.4263625 23.0199918,21.9605503 C22.8958076,21.995473 22.772917,22.0329825 22.6500265,22.073079 C17.5804669,23.7118584 15.0088199,28.2725028 15.0088199,28.2725028 C15.0088199,28.2725028 15.0127007,28.2763831 15.0127007,28.2776765 C13.5160228,26.6130284 12.605339,24.4128991 12.605339,21.9993533 L12.605339,21.9993533 Z M22.0006468,31.3935564 C19.7265244,31.3935564 17.6412654,30.5851608 16.015229,29.241284 C16.1394132,29.3408784 16.2260834,29.40555 16.2260834,29.40555 C16.2260834,29.40555 18.0267537,25.4786878 23.5982243,23.537245 C23.6189216,23.5294844 23.639619,23.5230172 23.6616099,23.5165501 C24.9836538,26.9519078 25.5282531,29.8285026 25.6679603,30.6498324 C24.5412477,31.1284026 23.3006997,31.3935564 22.0006468,31.3935564 L22.0006468,31.3935564 Z M27.2500147,29.790993 C27.1542894,29.2244694 26.653672,26.4668705 25.4208855,23.0819566 C28.4543423,22.5969193 31.0816135,23.4285966 31.2756512,23.4919748 C30.8578232,26.1085896 29.3585582,28.3669234 27.2500147,29.790993 L27.2500147,29.790993 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>

                    <g id="stackoverflow" transform="translate(100.000000, 280.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-84)" stroke-width="4" xlink:href="#path-83"></use>
                        <path
                            d="M25.4425714,26.5268493 L15.428342,25.583726 L15.2291294,27.7602466 L25.2576756,28.7031918 L25.4425714,26.5268493 Z M25.2007577,29.3271918 L15.1437526,29.3417945 L15.1437526,31.5322055 L25.2007577,31.518137 L25.2007577,29.3271918 Z M27.377081,21.1585616 L18.7142146,15.9352329 L17.6189819,17.8213014 L26.2816737,23.0446301 L27.377081,21.1585616 Z M26.1110946,23.6540274 L16.3955967,20.9988219 L15.8407347,23.1171096 L25.5564072,25.7724932 L26.1110946,23.6540274 Z M26.9215633,33.2734932 L13.7211548,33.2734932 L13.7211548,24.3070548 L12,24.3070548 L12,34.9853973 L12.0143168,34.9853973 L12.5122609,35 L28.6146083,35 L28.6146083,34.9853973 L28.6289251,34.4775068 L28.6289251,24.3070548 L26.9215633,24.3070548 L26.9215633,33.2734932 Z M30.2790198,9 L28.1592653,9.37717808 L29.8807693,19.4899315 L32,19.1127534 L30.2790198,9 Z M22.0570052,12.3805342 L27.7327304,20.853863 L29.4968355,19.6206438 L23.8350778,11.1328904 L22.0570052,12.3805342 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="github" transform="translate(160.000000, 280.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-86)" stroke-width="4" xlink:href="#path-85"></use>
                        <path
                            d="M10,22.3044338 C10,27.7398363 13.4380429,32.3519218 18.2065134,33.9789169 C18.8069002,34.0922174 19.0256914,33.7122831 19.0256914,33.3859777 C19.0256914,33.0936624 19.015378,32.3201977 19.0094846,31.2936952 C15.671629,32.0369464 14.9673716,29.6440399 14.9673716,29.6440399 C14.4214985,28.2224964 13.634734,27.8440727 13.634734,27.8440727 C12.5451978,27.0804274 13.7172412,27.0962895 13.7172412,27.0962895 C14.921698,27.1831532 15.555235,28.3644997 15.555235,28.3644997 C16.6263544,30.2445326 18.364161,29.7014455 19.0477915,29.3864702 C19.1568188,28.5911007 19.4669572,28.0495243 19.8095092,27.741347 C17.1449707,27.4309036 14.3434114,26.3756983 14.3434114,21.660887 C14.3434114,20.3171431 14.8111974,19.2188837 15.5788084,18.3585552 C15.4557844,18.0473565 15.0439854,16.7965191 15.6966758,15.1030543 C15.6966758,15.1030543 16.7044415,14.7714615 18.9962246,16.3637112 C19.9538967,16.0910346 20.9800792,15.9543187 22.0003683,15.9497867 C23.0199208,15.9543187 24.0461033,16.0910346 25.0052488,16.3637112 C27.2955585,14.7714615 28.3018509,15.1030543 28.3018509,15.1030543 C28.9560146,16.7965191 28.5442156,18.0473565 28.4211916,18.3585552 C29.1902759,19.2188837 29.6543786,20.3171431 29.6543786,21.660887 C29.6543786,26.3870284 26.8491359,27.4271269 24.1757574,27.7322829 C24.6067098,28.1122172 24.9897787,28.8630219 24.9897787,30.0103782 C24.9897787,31.6555014 24.9757819,32.9826279 24.9757819,33.3859777 C24.9757819,33.7153044 25.1916265,34.0975048 25.8008533,33.9774062 C30.5649038,32.3473898 34,27.7390809 34,22.3044338 C34,15.5086701 28.6267227,10 21.998895,10 C15.3732773,10 10,15.5086701 10,22.3044338 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="codepen" transform="translate(220.000000, 280.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-88)" stroke-width="4" xlink:href="#path-87"></use>
                        <path
                            d="M27.2730015,20.759256 L22.9880683,17.7689622 L22.9880683,12.9583772 L30.7321698,18.3452369 L27.2730015,20.759256 Z M29.0505952,22.0000404 L31.5235537,20.2741251 L31.5235537,23.7256325 L29.0505952,22.0000404 Z M22.9880683,26.2311186 L27.2730015,23.2408248 L30.7321698,25.6548439 L22.9880683,31.0417036 L22.9880683,26.2311186 Z M16.7266888,23.2408248 L21.011622,26.2311186 L21.011622,31.0417036 L13.2678302,25.6548439 L16.7266888,23.2408248 Z M14.949095,22.0000404 L12.4764463,23.7256325 L12.4764463,20.2741251 L14.949095,22.0000404 Z M21.011622,17.7689622 L16.7266888,20.759256 L13.2678302,18.3452369 L21.011622,12.9583772 L21.011622,17.7689622 Z M22,24.4395926 L18.5042825,22.0000404 L22,19.560165 L25.4957175,22.0000404 L22,24.4395926 Z M33.4832741,18.1645653 C33.4780085,18.1351536 33.4733624,18.1063884 33.4659287,18.0779463 C33.4612826,18.0608164 33.4557073,18.0446562 33.4504417,18.0278495 C33.4426982,18.0026395 33.4349548,17.9774295 33.4250431,17.9525427 C33.4182288,17.935736 33.4104853,17.9189294 33.4030516,17.9024459 C33.3925205,17.8791752 33.3816796,17.8562276 33.36929,17.8339264 C33.3603076,17.817443 33.3507057,17.8019291 33.3411037,17.7860921 C33.327785,17.7647605 33.3141564,17.7437522 33.2992889,17.7233903 C33.2884481,17.7085229 33.2772975,17.6936554 33.2655274,17.6791112 C33.2500404,17.6597189 33.2333145,17.6412962 33.2162788,17.6231967 C33.2032698,17.6092989 33.1902607,17.5957243 33.1769419,17.5827961 C33.1589771,17.5659894 33.140083,17.5498291 33.1208791,17.5339921 C33.1060116,17.5220335 33.0914539,17.5097517 33.0759669,17.4987627 C33.0707014,17.4945611 33.0654358,17.489713 33.0598605,17.4858345 L22.5479288,10.1733187 C22.216198,9.94222709 21.7834922,9.94222709 21.4517615,10.1733187 L10.9401395,17.4858345 C10.9342545,17.489713 10.9292986,17.4945611 10.9237233,17.4987627 C10.9082364,17.5097517 10.8936786,17.5220335 10.8788111,17.5339921 C10.859917,17.5498291 10.8407132,17.5659894 10.8230581,17.5827961 C10.8094295,17.5957243 10.7964205,17.6092989 10.7837212,17.6231967 C10.7663758,17.6412962 10.7499596,17.6597189 10.7341629,17.6791112 C10.7223928,17.6936554 10.7112422,17.7085229 10.7004013,17.7233903 C10.6855338,17.7437522 10.6719053,17.7647605 10.6585865,17.7860921 C10.6489846,17.8019291 10.6393827,17.817443 10.63071,17.8339264 C10.6180107,17.8562276 10.6071698,17.8791752 10.5969484,17.9024459 C10.5895147,17.9189294 10.5814614,17.935736 10.5749569,17.9525427 C10.565355,17.9774295 10.556992,18.0026395 10.5492485,18.0278495 C10.543983,18.0446562 10.5384077,18.0608164 10.5340713,18.0779463 C10.5269473,18.1063884 10.5216817,18.1351536 10.5167259,18.1645653 C10.514248,18.1794327 10.5108409,18.1939769 10.5086727,18.2088444 C10.5030974,18.2534467 10.5,18.2983722 10.5,18.3436209 L10.5,25.6561367 C10.5,25.7017086 10.5030974,25.7463109 10.5086727,25.7909132 C10.5108409,25.8061039 10.514248,25.8206481 10.5167259,25.8355155 C10.5216817,25.8642808 10.5269473,25.8933692 10.5340713,25.9218113 C10.5384077,25.9389412 10.543983,25.9554246 10.5492485,25.9719081 C10.556992,25.9974413 10.565355,26.0226513 10.5749569,26.0475381 C10.5814614,26.064668 10.5895147,26.0808282 10.5969484,26.0973117 C10.6071698,26.1205824 10.6180107,26.14353 10.63071,26.1661544 C10.6393827,26.1823146 10.6489846,26.1981517 10.6585865,26.2133423 C10.6719053,26.2349971 10.6855338,26.2556822 10.7004013,26.2763673 C10.7112422,26.2918812 10.7223928,26.3064254 10.7341629,26.3209696 C10.7499596,26.3400387 10.7663758,26.3587846 10.7837212,26.3765609 C10.7964205,26.3901355 10.8094295,26.4040333 10.8230581,26.4166383 C10.8407132,26.4337682 10.859917,26.4502517 10.8788111,26.4660887 C10.8936786,26.4780473 10.9082364,26.4900059 10.9237233,26.5013181 C10.9292986,26.5055197 10.9342545,26.5100446 10.9401395,26.5139231 L21.4517615,33.8264389 C21.6177817,33.9421463 21.8085811,34 22,34 C22.1911091,34 22.3822183,33.9421463 22.5479288,33.8264389 L33.0598605,26.5139231 C33.0654358,26.5100446 33.0707014,26.5055197 33.0759669,26.5013181 C33.0914539,26.4900059 33.1060116,26.4780473 33.1208791,26.4660887 C33.140083,26.4502517 33.1589771,26.4337682 33.1769419,26.4166383 C33.1902607,26.4040333 33.2032698,26.3901355 33.2162788,26.3765609 C33.2333145,26.3587846 33.2500404,26.3400387 33.2655274,26.3209696 C33.2772975,26.3064254 33.2884481,26.2918812 33.2992889,26.2763673 C33.3141564,26.2556822 33.327785,26.2349971 33.3411037,26.2133423 C33.3507057,26.1981517 33.3603076,26.1823146 33.36929,26.1661544 C33.3816796,26.14353 33.3925205,26.1205824 33.4030516,26.0973117 C33.4104853,26.0808282 33.4182288,26.064668 33.4250431,26.0475381 C33.4349548,26.0226513 33.4426982,25.9974413 33.4504417,25.9719081 C33.4557073,25.9554246 33.4612826,25.9389412 33.4659287,25.9218113 C33.4733624,25.8933692 33.4780085,25.8642808 33.4832741,25.8355155 C33.485752,25.8206481 33.4891591,25.8061039 33.4910176,25.7909132 C33.4965929,25.7463109 33.5,25.7017086 33.5,25.6561367 L33.5,18.3436209 C33.5,18.2983722 33.4965929,18.2534467 33.4910176,18.2088444 C33.4891591,18.1939769 33.485752,18.1794327 33.4832741,18.1645653 L33.4832741,18.1645653 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="jsfiddle" transform="translate(280.000000, 280.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-90)" stroke-width="4" xlink:href="#path-89"></use>
                        <path
                            d="M34,25.1792857 C34,27.8385714 31.8789062,30 29.2773438,30 C29.1850469,30 29.1015625,29.9878571 29.0195312,29.9878571 L14.7578125,29.9878571 C12.1328125,29.83 10,27.7535714 10,25.0578571 C10,23.2485714 10.9492188,21.6692229 12.3671875,20.8086343 C12.2741875,20.49292 12.2258125,20.1650629 12.2258125,19.8121429 C12.2258125,17.9542857 13.6914062,16.4485714 15.5187812,16.4485714 C16.2687812,16.4485714 16.9719062,16.7157143 17.5344062,17.1528571 C18.6835938,14.7 21.1210938,13 23.96875,13 C27.9179688,13 31.1054688,16.2664286 31.1054688,20.2857143 C31.1054688,20.4322057 31.09375,20.5786486 31.09375,20.7228571 C32.7929688,21.4514286 34,23.1757143 34,25.1792857 L34,25.1792857 Z M18.907,27.1585714 C20.0561875,27.1585714 20.8867188,26.7821429 21.7195,25.9579343 C21.3789062,25.5207914 21.0039062,25.0942857 20.6530938,24.6586486 C20.173375,25.1428571 19.6452813,25.4479343 18.9655938,25.4479343 C18.1328125,25.4479343 17.4187188,24.87722 17.4187188,23.9786486 C17.4187188,23.0937257 18.1343125,22.5108686 18.9429063,22.5108686 C21.5217812,22.5108686 22.0718125,27.1737257 25.8218125,27.1737257 C27.6513906,27.1737257 29.1968125,25.98222 29.1968125,23.9922971 C29.1968125,21.9758057 27.6382188,20.79722 25.7881094,20.79722 C24.6382188,20.79722 23.7842031,21.1379971 22.9638906,21.9758543 C23.3388906,22.4000771 23.689,22.8493629 24.0537344,23.28806 C24.5224844,22.8129829 25.0498281,22.5109171 25.7177969,22.5109171 C26.4912344,22.5109171 27.2632188,23.0816314 27.2632188,23.9316314 C27.2632188,24.8666314 26.6055156,25.4601257 25.7295156,25.4601257 C23.2334219,25.4601257 22.5654531,20.7972686 18.9084531,20.7972686 C17.0920469,20.7972686 15.4873281,21.95084 15.4873281,23.9544114 C15.483625,26.005 17.0422187,27.1585714 18.907,27.1585714 L18.907,27.1585714 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>

                    <g id="kickstarter" transform="translate(460.000000, 280.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-96)" stroke-width="4" xlink:href="#path-95"></use>
                        <path
                            d="M20.7805128,19.1342656 L24.0202975,14.3515978 C24.6328269,13.4505326 25.4234621,13 26.3929776,13 C27.1838065,13 27.8679654,13.2858239 28.4466159,13.8576689 C29.0246856,14.4295139 29.3137205,15.113992 29.3137205,15.9111033 C29.3137205,16.5003068 29.1609754,17.0202735 28.8547107,17.4708061 L25.9335806,21.7986017 L29.5051843,26.4124184 C29.8623641,26.8716302 30.0408571,27.4089554 30.0408571,28.0239995 C30.0408571,28.8386665 29.760534,29.5379389 29.1991133,30.1228028 C28.6378861,30.7078639 27.9572119,31 27.1582522,31 C26.2822422,31 25.614926,30.7100338 25.1555289,30.1293122 L20.7805128,24.5668917 L20.7805128,27.6342217 C20.7805128,28.5094464 20.6318331,29.1893876 20.3340865,29.6746373 C19.7898956,30.5581467 18.9990668,31 17.9617936,31 C17.0178324,31 16.2862432,30.6751194 15.7678002,30.0253583 C15.2830424,29.4274756 15.0408571,28.6345066 15.0408571,27.6472406 L15.0408571,16.2750405 C15.0408571,15.3392583 15.2871079,14.5683821 15.7805773,13.96182 C16.2992139,13.3207382 17.0133798,13 17.9232685,13 C18.7907603,13 19.5134443,13.3207382 20.0917077,13.96182 C20.414815,14.3168807 20.6188624,14.6764783 20.7038498,15.0404156 C20.7549585,15.2658791 20.7805128,15.685837 20.7805128,16.3010783 L20.7805128,19.1342656"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="reddit" transform="translate(520.000000, 280.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-98)" stroke-width="4" xlink:href="#path-97"></use>
                        <path
                            d="M25.868095,25.4270036 C24.8961955,25.4270036 24.0795074,24.6459431 24.0795074,23.6829035 C24.0795074,22.719864 24.8961955,21.9130366 25.868095,21.9130366 C26.8399945,21.9130366 27.6282408,22.719864 27.6282408,23.6829035 C27.6282408,24.6459431 26.8399945,25.4270036 25.868095,25.4270036 M26.2809085,28.8121359 C25.3756443,29.7083424 23.9795545,30.1439648 22.013002,30.1439648 C22.0089389,30.1439648 22.0040631,30.1431596 21.9991874,30.1431596 C21.9951242,30.1431596 21.9902485,30.1439648 21.9853727,30.1439648 C20.0188202,30.1439648 18.6235431,29.7083424 17.7190915,28.8121359 C17.4411737,28.5367517 17.4411737,28.0914667 17.7190915,27.8168877 C17.9961966,27.5423087 18.4455782,27.5423087 18.723496,27.8168877 C19.347592,28.4352943 20.4145686,28.7364455 21.9853727,28.7364455 C21.9902485,28.7364455 21.9951242,28.7372507 21.9991874,28.7372507 C22.0040631,28.7372507 22.0089389,28.7364455 22.013002,28.7364455 C23.5838061,28.7364455 24.6515954,28.4352943 25.276504,27.8168877 C25.5544218,27.5415034 26.0038034,27.5423087 26.2809085,27.8168877 C26.5580136,28.0922719 26.5580136,28.5375569 26.2809085,28.8121359 M16.3717592,23.6829035 C16.3717592,22.7206692 17.1868221,21.9130366 18.157909,21.9130366 C19.1298085,21.9130366 19.9180547,22.7206692 19.9180547,23.6829035 C19.9180547,24.6459431 19.1298085,25.4270036 18.157909,25.4270036 C17.1868221,25.4270036 16.3717592,24.6459431 16.3717592,23.6829035 M30.665833,12.5725193 C31.3240593,12.5725193 31.8595792,13.1031573 31.8595792,13.7545779 C31.8595792,14.4068036 31.3240593,14.9374416 30.665833,14.9374416 C30.0076068,14.9374416 29.4720869,14.4068036 29.4720869,13.7545779 C29.4720869,13.1031573 30.0076068,12.5725193 30.665833,12.5725193 M35.002,21.7672923 C35.002,20.059427 33.6002219,18.6704277 31.8766443,18.6704277 C31.1306545,18.6704277 30.4456117,18.931318 29.9076539,19.36533 C28.0020483,18.1784401 25.5836763,17.4634074 22.9914025,17.3120266 L24.3436105,13.0757799 L28.0597446,13.9429986 C28.1572596,15.2836849 29.2884337,16.344961 30.665833,16.344961 C32.1066172,16.344961 33.279235,15.1830328 33.279235,13.7545779 C33.279235,12.3269281 32.1066172,11.165 30.665833,11.165 C29.658178,11.165 28.7821683,11.7334832 28.3457886,12.5636619 L24.0274994,11.5563354 C23.6658813,11.4717876 23.3002,11.6779232 23.1880578,12.0289978 L21.5091745,17.2870649 C18.7161824,17.3547031 16.090591,18.0721514 14.0452138,19.32829 C13.5145697,18.9168241 12.8474046,18.6704277 12.1233557,18.6704277 C10.3997781,18.6704277 8.99799995,20.059427 8.99799995,21.7672923 C8.99799995,22.8229318 9.53433246,23.7561783 10.3510206,24.3149989 C10.3168903,24.5605901 10.2990126,24.8077917 10.2990126,25.0582142 C10.2990126,27.1928445 11.5512677,29.1785096 13.8249925,30.6488359 C16.0044527,32.0587708 18.8892715,32.835 21.9471794,32.835 C25.0050873,32.835 27.889906,32.0587708 30.0693663,30.6488359 C32.343091,29.1785096 33.5953462,27.1928445 33.5953462,25.0582142 C33.5953462,24.8303378 33.5799063,24.6040718 33.5514644,24.3794163 C34.4225984,23.829453 35.002,22.8639978 35.002,21.7672923"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="reddit-light" transform="translate(580.000000, 280.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-100)" stroke-width="4" xlink:href="#path-99"></use>
                        <path
                            d="M18.0812945,27.7968363 C18.0620017,27.8007479 18.0419669,27.8054418 18.0234162,27.8124826 C17.7525751,27.8688091 17.5759719,28.1457479 17.6301401,28.4320744 C17.6501749,28.538469 17.701375,28.6370404 17.7770621,28.7121424 C18.8982699,29.8942172 20.5678381,30.08119 21.9027506,30.0858839 C21.9220434,30.0866662 21.9420782,30.0858839 21.961371,30.0858839 C21.9702754,30.0866662 21.9799218,30.0866662 21.9903102,30.0858839 L22.0044088,30.0858839 C23.3467416,30.0858839 25.0259562,29.9059519 26.1590365,28.7121424 C26.3556745,28.5087411 26.3593847,28.1746935 26.1664568,27.9673805 C26.0588624,27.8508159 25.9067462,27.7937071 25.7538879,27.8124826 C25.6418413,27.8320404 25.5401832,27.8907139 25.4637541,27.9791152 C24.6742338,28.8122785 23.282927,29.0258499 22.0474465,29.0328907 L21.9903102,29.0328907 C21.9799218,29.0321084 21.9702754,29.0321084 21.961371,29.0328907 L21.888652,29.0328907 C20.6576238,29.0250676 19.2722532,28.8091492 18.4864431,27.9791152 C18.385527,27.8555098 18.2356368,27.7882309 18.0812945,27.7968363 L18.0812945,27.7968363 Z M25.8985838,21.4319385 C24.9109415,21.4319385 24.1028705,22.2815303 24.1028705,23.3243534 C24.1028705,24.3663942 24.9109415,25.2167684 25.8985838,25.2167684 C26.8862262,25.2167684 27.6935552,24.3663942 27.6935552,23.3243534 C27.6935552,22.2823126 26.8862262,21.4319385 25.8985838,21.4319385 L25.8985838,21.4319385 Z M18.0523553,21.4319385 C17.0632289,21.4319385 16.256642,22.2823126 16.256642,23.3243534 C16.256642,24.3663942 17.0632289,25.2167684 18.0523553,25.2167684 C19.0399977,25.2167684 19.8473267,24.3663942 19.8473267,23.3243534 C19.8473267,22.2815303 19.0399977,21.4319385 18.0523553,21.4319385 L18.0523553,21.4319385 Z M32.0077194,19.1882651 C33.0940517,19.1882651 33.9614852,20.1027889 33.9614852,21.2488773 C33.9614852,21.913061 33.6654151,22.5029249 33.2090664,22.8823466 C32.7853671,21.6400338 31.9617135,20.5166324 30.8642507,19.5856801 C31.1833237,19.3345576 31.5728896,19.1882651 32.0077194,19.1882651 L32.0077194,19.1882651 Z M11.9135386,19.1882651 C12.3231393,19.1882651 12.6889603,19.330646 12.9991289,19.5551699 C11.9061183,20.4728229 11.0802386,21.5821426 10.6402146,22.80568 C10.2254196,22.4278228 9.9597728,21.8778569 9.9597728,21.2488773 C9.9597728,20.1027889 10.8286903,19.1882651 11.9135386,19.1882651 L11.9135386,19.1882651 Z M21.9175912,17.6924828 C24.9012951,17.6924828 27.5874448,18.5420746 29.5033671,19.8594896 C31.4192893,21.1784691 32.5286246,22.9245915 32.5286246,24.8201357 C32.5286246,26.7156799 31.4192893,28.4782309 29.5033671,29.7964281 C27.5874448,31.1138431 24.9012951,31.9485709 21.9175912,31.9485709 C18.9331453,31.9485709 16.2469956,31.1138431 14.3310733,29.7964281 C12.4158931,28.4782309 11.2768766,26.7156799 11.2768766,24.8201357 C11.2768766,22.9245915 12.4158931,21.1784691 14.3310733,19.8594896 C16.2469956,18.5420746 18.9331453,17.6924828 21.9175912,17.6924828 L21.9175912,17.6924828 Z M30.7766911,11.0686394 C31.5751157,11.0686394 32.2102936,11.7515986 32.2102936,12.5949319 C32.2102936,13.4374829 31.5751157,14.1063605 30.7766911,14.1063605 C29.9760404,14.1063605 29.3438306,13.4374829 29.3438306,12.5949319 C29.3438306,11.7515986 29.9760404,11.0686394 30.7766911,11.0686394 L30.7766911,11.0686394 Z M30.7766911,10.0007823 C29.7764342,10.0007823 28.9060327,10.652449 28.5335335,11.5724489 L23.9878558,10.4427891 C23.9366557,10.4240136 23.8824875,10.4130612 23.8283193,10.4114966 C23.6227769,10.432619 23.4498838,10.5843877 23.3942315,10.7940476 L21.6133588,16.6543536 C18.6170404,16.7083332 15.9012095,17.5430611 13.8680464,18.9136733 C13.3463991,18.42551 12.6652153,18.1344896 11.9135386,18.1344896 C10.2877502,18.1344896 8.961,19.5332651 8.961,21.2488773 C8.961,22.3621086 9.52791116,23.3470405 10.3656634,23.9040473 C10.3181734,24.2021085 10.2781038,24.5119044 10.2781038,24.8193534 C10.2781038,27.1522105 11.6708947,29.213605 13.7812289,30.6655778 C15.8923051,32.1167682 18.7572841,33.0007818 21.9175912,32.9999995 C25.0778983,32.9999995 27.9421353,32.1167682 30.0532115,30.6655778 C32.1642878,29.213605 33.5273974,27.1522105 33.5273974,24.8193534 C33.5273974,24.528333 33.5110728,24.2318364 33.4695191,23.9502038 C34.3599554,23.4088432 34.961,22.4035711 34.961,21.2488773 C34.961,19.5332651 33.6349918,18.1344896 32.0077194,18.1344896 C31.238976,18.1344896 30.5496298,18.450544 30.0242724,18.9590474 C28.0853472,17.6338094 25.5179223,16.7975169 22.670752,16.6692175 L24.2045286,11.5873129 L28.3450578,12.6097959 C28.3532201,14.0148298 29.4417786,15.1585713 30.7766911,15.1585713 C32.1160558,15.1585713 33.2090664,14.0070067 33.2090664,12.5941496 C33.2090664,11.1820748 32.1153138,10 30.7766911,10 L30.7766911,10.0007823 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>

                    <g id="slack" transform="translate(340.000000, 340.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-112)" stroke-width="4" xlink:href="#path-111"></use>
                        <path
                            d="M28.2558639,23.8834631 L26.8306739,24.360589 L27.3242997,25.8359666 C27.5243626,26.4327176 27.202612,27.0789688 26.6051735,27.2790317 C26.4752357,27.3230317 26.3432355,27.3415943 26.2139853,27.3381568 C25.7478594,27.3257817 25.3181712,27.0274062 25.1621084,26.5599054 L24.667795,25.0852152 L21.7287273,26.069717 L22.2223531,27.5444071 C22.422416,28.1418457 22.1006654,28.7880968 21.5032269,28.9881597 C21.3732891,29.0314723 21.2412889,29.0500348 21.1120387,29.0465973 C20.6459128,29.0349098 20.2162246,28.7358468 20.0601618,28.2690334 L19.5658484,26.7936558 L18.1406584,27.2714691 C18.0107206,27.3147817 17.8780329,27.3333443 17.7487827,27.3299067 C17.2833443,27.3182192 16.8536561,27.0191562 16.6969058,26.5516554 C16.4968429,25.9549043 16.8185935,25.3086531 17.4160321,25.1085903 L18.8419096,24.6307769 L17.8938454,21.8017094 L16.4686554,22.2795227 C16.3387177,22.3228353 16.2067174,22.3413979 16.0767797,22.3379603 C15.6113414,22.3262728 15.1816531,22.0272098 15.0249028,21.559709 C14.82484,20.9629579 15.147278,20.3167067 15.7440291,20.1166439 L17.1699066,19.6388305 L16.6755933,18.1641404 C16.4755304,17.5667018 16.797281,16.9204507 17.3947195,16.7210753 C17.9921581,16.5210125 18.6384093,16.8427631 18.8384721,17.4402016 L19.332098,18.9148917 L22.2718532,17.93039 L21.7775399,16.4556999 C21.577477,15.8582613 21.8999151,15.2120101 22.4966661,15.0119473 C23.0941047,14.8118844 23.7403559,15.1343225 23.9404187,15.7310736 L24.4340446,17.2064512 L25.8599221,16.7286378 C26.4573607,16.528575 27.1029244,16.8510131 27.3029872,17.4477641 C27.5030501,18.0452027 27.1812995,18.6914538 26.5838609,18.8915167 L25.1586709,19.3686426 L26.1060476,22.1983976 L27.5319251,21.7205842 C28.1286762,21.5212089 28.7749273,21.8429595 28.9749902,22.4397105 C29.175053,23.0371491 28.8533025,23.6834002 28.2558639,23.8834631 M19.9375159,20.9220177 L20.8848926,23.7510852 L23.8246479,22.7665835 L22.8772712,19.9375159 L19.9375159,20.9220177 Z M32.0790582,18.9760794 C29.8116792,11.4163159 26.5357358,9.65287523 18.9759724,11.9209418 C11.4168964,14.1883208 9.65276824,17.4642642 11.9208348,25.0240276 C14.1889013,32.5831036 17.4648447,34.3472318 25.0239206,32.0791652 C32.5836841,29.8110987 34.3471248,26.5351553 32.0790582,18.9760794 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="messenger" transform="translate(400.000000, 340.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-114)" stroke-width="4" xlink:href="#path-113"></use>
                        <path
                            d="M22,11 C15.9248571,11 11,15.5600432 11,21.1851852 C11,24.390463 12.5995776,27.2495123 15.0993789,29.1165247 L15.0993789,33 L18.8447764,30.9444259 C19.8443416,31.2210556 20.9032795,31.3703704 22,31.3703704 C28.0751429,31.3703704 33,26.8103272 33,21.1851852 C33,15.5600432 28.0751429,11 22,11 L22,11 Z M23.0931677,24.7160494 L20.2919255,21.7283951 L14.826087,24.7160494 L20.8385093,18.3333333 L23.7080745,21.3209877 L29.1055901,18.3333333 L23.0931677,24.7160494 L23.0931677,24.7160494 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="snapchat" transform="translate(460.000000, 340.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-116)" stroke-width="4" xlink:href="#path-115"></use>
                        <path
                            d="M21.778565,12.0039794 C21.2901823,12.0039794 20.3130178,12.072766 19.2633884,12.5347161 C18.663258,12.7986633 18.1234486,13.1555576 17.6590118,13.5955074 C17.105291,14.1197066 16.6541955,14.7660161 16.3184965,15.5167562 C15.826864,16.615977 15.9435719,18.4674727 16.037303,19.9553661 C16.0476796,20.1170429 16.0582272,20.2834382 16.0678626,20.4455699 C15.9957398,20.4785988 15.8788039,20.5134469 15.7064503,20.5134469 C15.4291337,20.5134469 15.0993642,20.4250476 14.7265491,20.2508641 C14.616854,20.1999279 14.491651,20.1741756 14.3535059,20.1741756 C14.13155,20.1741756 13.8975642,20.2393239 13.694594,20.3583076 C13.4392279,20.5078189 13.2742291,20.7191244 13.2294161,20.9533967 C13.1998828,21.1083655 13.2013081,21.4146647 13.5425374,21.7252844 C13.7302278,21.8962844 14.005948,22.0539819 14.3618299,22.1942269 C14.455219,22.2308941 14.5660544,22.2659127 14.6834464,22.3030347 C15.0908121,22.4321375 15.7073625,22.6271844 15.8681422,23.0044872 C15.9496154,23.1957821 15.9145517,23.4475069 15.7642055,23.7517595 C15.7151734,23.8642057 15.3646508,24.6558766 14.6456461,25.4908092 C14.2370831,25.9656071 13.7870709,26.3624089 13.3088367,26.6705273 C12.7251264,27.0466932 12.0935243,27.2926194 11.4317618,27.4013136 C11.1718915,27.4438362 10.9863107,27.6746976 11.0007923,27.937053 C11.0052394,28.0126613 11.0230278,28.0880423 11.0538724,28.1609788 C11.1596905,28.4073598 11.4033117,28.6155387 11.7993886,28.7991591 C12.2833812,29.0233123 13.0072321,29.2118785 13.9506443,29.3594001 C13.9983081,29.4497891 14.0477963,29.6769553 14.0820618,29.8324926 C14.1179237,29.9978077 14.1553249,30.1677845 14.2086331,30.348335 C14.2661603,30.5439504 14.4153662,30.777711 14.7986719,30.777711 C14.9439438,30.777711 15.1109951,30.74508 15.3044439,30.7076738 C15.5877469,30.6522466 15.9751577,30.5766382 16.4586942,30.5766382 C16.7267744,30.5766382 17.0046041,30.6001734 17.2842582,30.6465049 C17.8233264,30.7359843 18.2880483,31.0633174 18.8257482,31.4423826 C19.6127707,31.9971093 20.5036159,32.625 21.8647133,32.625 C21.9018294,32.625 21.9390596,32.6238062 21.9758337,32.621248 C22.0208179,32.6233514 22.0765776,32.625 22.1354162,32.625 C23.4969127,32.625 24.3875298,31.996882 25.1736971,31.44261 C25.7127653,31.0628626 26.176974,30.7359843 26.7158712,30.6465049 C26.9954113,30.6002303 27.273184,30.5766382 27.5413783,30.5766382 C28.0033064,30.5766382 28.3690518,30.6353626 28.6956285,30.6988623 C28.9087472,30.7407027 29.0743731,30.760827 29.2014575,30.760827 C29.5071101,30.7610544 29.713102,30.6076206 29.7917244,30.3391256 C29.8439493,30.1623839 29.8812366,29.9963865 29.9180106,29.8282858 C29.9500526,29.6825265 30.0012512,29.4488795 30.048915,29.3575241 C30.9929543,29.2097183 31.7165201,29.02155 32.2005698,28.7974536 C32.5957344,28.614686 32.8390706,28.4067345 32.9447747,28.1626843 C32.9764745,28.0895204 32.9950041,28.0136846 32.9991661,27.9364845 C33.0140468,27.6745839 32.8281809,27.4432677 32.5681396,27.4007451 C29.6270677,26.9174199 28.3021173,23.904227 28.2473267,23.7762044 C28.0852927,23.4469384 28.0505711,23.1954979 28.1321013,23.0038619 C28.2925389,22.6269001 28.9086902,22.4318532 29.3163409,22.3028073 C29.4343601,22.2657422 29.5455946,22.2304962 29.6382425,22.1939995 C30.0395647,22.0359609 30.3264026,21.8645061 30.5156323,21.6698003 C30.7416362,21.4376883 30.7856511,21.2152973 30.7829144,21.0697654 C30.7760157,20.7176464 30.506054,20.4047527 30.0766238,20.2515463 C29.93158,20.1917418 29.7661821,20.1601909 29.5977625,20.1601909 C29.4831072,20.1601909 29.3133192,20.175881 29.1525965,20.2506936 C28.8085164,20.4112335 28.5002983,20.4990074 28.2356959,20.511514 C28.0949851,20.504408 27.9962937,20.4739941 27.9323809,20.4449446 C27.9404199,20.3075988 27.9493141,20.1665011 27.9584933,20.0193774 L27.9623133,19.9563893 C28.0565576,18.4675296 28.1736645,16.6146126 27.681804,15.5145959 C27.3446796,14.761184 26.8919878,14.1132258 26.3360434,13.5878897 C25.8697821,13.1476556 25.3281483,12.7908182 24.7258514,12.5270416 C23.6777044,12.0685023 22.7005969,12 22.21153,12 C22.021274,12.0015918 21.7985769,12.003752 21.778565,12.0039794 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>

                    <g id="upwork" transform="translate(220.000000, 400.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-128)" stroke-width="4" xlink:href="#path-127"></use>
                        <path
                            d="M30.1084635,25.7939644 C28.912609,25.7939644 27.7935057,25.2721604 26.7749903,24.4235536 L27.0228343,23.2219465 L27.0318089,23.1753979 C27.2550983,21.8993425 27.951316,19.7586215 30.1084635,19.7586215 C31.7230395,19.7586215 33.0362107,21.1125293 33.0362107,22.7765149 C33.0362107,24.4403526 31.7230395,25.7939644 30.1084635,25.7939644 L30.1084635,25.7939644 Z M30.1084635,16.7040959 C27.3566914,16.7040959 25.2219445,18.5450257 24.3562136,21.5796442 C23.0337088,19.5314284 22.0283323,17.071157 21.4444773,15 L18.4809033,15 L18.4809033,22.9432465 C18.4809033,24.5107306 17.243191,25.7859719 15.7219514,25.7859719 C14.2010709,25.7859719 12.963574,24.5107306 12.963574,22.9432465 L12.963574,15 L10,15 L10,22.9432465 C10,26.1949194 12.5670379,28.8644008 15.7219514,28.8644008 C18.877224,28.8644008 21.4444773,26.1949194 21.4444773,22.9432465 L21.4444773,21.6133901 C22.0186397,22.8486691 22.7251243,24.1011911 23.5833883,25.2090348 L21.7705085,34 L24.8001359,34 L26.115102,27.6239415 C27.2662269,28.3823371 28.5903112,28.8644008 30.1084635,28.8644008 C33.3570724,28.8644008 36,26.1245414 36,22.7765149 C36,19.4281925 33.3570724,16.7040959 30.1084635,16.7040959 L30.1084635,16.7040959 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>

                    <g id="shopify" transform="translate(460.000000, 400.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-136)" stroke-width="4" xlink:href="#path-135"></use>
                        <path
                            d="M23.1517822,13.4942857 C23.1517822,13.4164286 23.152493,13.34 23.152493,13.2564286 C23.152493,12.5278571 23.0515654,11.9407143 22.8902235,11.4757143 C23.539145,11.5571429 23.9712854,12.2992857 24.2491915,13.1528571 C23.9236647,13.2542857 23.5533601,13.3692857 23.1517822,13.4942857 L23.1517822,13.4942857 Z M21.7188955,20.7585714 C21.7188955,20.7585714 20.9598067,20.3514286 20.0294254,20.3514286 C18.6647713,20.3514286 18.5958279,21.2121429 18.5958279,21.4285714 C18.5958279,22.6121429 21.6648779,23.0657143 21.6648779,25.8371429 C21.6648779,28.0171429 20.2888518,29.4214286 18.4330644,29.4214286 C16.2062618,29.4214286 15.0676286,28.0285714 15.0676286,28.0285714 L15.6639539,26.0492857 C15.6639539,26.0492857 16.8345712,27.0592857 17.8225239,27.0592857 C18.4671808,27.0592857 18.730161,26.5485714 18.730161,26.1757143 C18.730161,24.6321429 16.2119478,24.5628571 16.2119478,22.0264286 C16.2119478,19.8921429 17.7365223,17.8264286 20.8141014,17.8264286 C21.9996446,17.8264286 22.5860194,18.1678571 22.5860194,18.1678571 L21.7188955,20.7585714 Z M21.213547,10.7907143 C21.3407726,10.7907143 21.4679982,10.8342857 21.5902484,10.9185714 C20.6499165,11.3628571 19.6427734,12.4828571 19.2170297,14.7185714 C18.5951171,14.9121429 17.9874196,15.1014286 17.4252106,15.2764286 C17.9234514,13.5707143 19.1068624,10.7907143 21.213547,10.7907143 L21.213547,10.7907143 Z M22.3834536,13.6057143 C22.3834536,13.6507143 22.3827428,13.6921429 22.3827428,13.7335714 C21.6684317,13.9557143 20.8929955,14.1971429 20.115427,14.4392857 C20.551832,12.7464286 21.3699136,11.9285714 22.0856463,11.62 C22.2654679,12.0742857 22.3834536,12.7264286 22.3834536,13.6057143 L22.3834536,13.6057143 Z M29.5173247,14.4507143 C29.501688,14.3357143 29.4014713,14.2721429 29.3183127,14.265 C29.2358648,14.2578571 27.4881126,14.1278571 27.4881126,14.1278571 C27.4881126,14.1278571 26.2734283,12.9164286 26.1405167,12.7828571 C26.0068943,12.6485714 25.7467572,12.6892857 25.6458296,12.7192857 C25.6309037,12.7235714 25.3807172,12.8014286 24.9663456,12.93 C24.5605032,11.7571429 23.8447706,10.6792857 22.5860194,10.6792857 C22.5511923,10.6792857 22.5149437,10.6807143 22.4794058,10.6828571 C22.1211841,10.2071429 21.6776716,10 21.2945734,10 C18.3612779,10 16.9596645,13.6857143 16.5204165,15.5578571 C15.3803618,15.9128571 14.5708092,16.165 14.4677494,16.1978571 C13.8309108,16.3985714 13.8110096,16.4185714 13.727851,17.0207143 C13.6645936,17.4771429 12,30.415 12,30.415 L24.9713209,32.8571429 L32,31.3292857 C32,31.3292857 29.5329614,14.5657143 29.5173247,14.4507143 L29.5173247,14.4507143 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="favorite" transform="translate(520.000000, 400.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-138)" stroke-width="4" xlink:href="#path-137"></use>
                        <polyline
                            id="Shape"
                            fill="#000000"
                            points="33 18.990125 25.399 17.884625 22 11 18.599625 17.884625 11 18.990125 16.5 24.35125 15.202 31.91925 22 28.347 28.796625 31.91925 27.5 24.35125 33 18.990125"
                        ></polyline>
                    </g>
                    <g id="like" transform="translate(580.000000, 400.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-140)" stroke-width="4" xlink:href="#path-139"></use>
                        <path
                            d="M26.1984384,15 C25.7833288,15 25.3597123,15.0746672 24.9278356,15.2238737 C24.4958356,15.373208 24.0940411,15.5747071 23.7225753,15.8281153 C23.350863,16.0815234 23.0313014,16.3194611 22.763274,16.5416727 C22.4954932,16.7638842 22.2410274,17.000032 22,17.249988 C21.7588493,17.000032 21.5043836,16.7638842 21.2366027,16.5416727 C20.9686986,16.3194611 20.6490137,16.0816512 20.2773014,15.8281153 C19.905589,15.5745793 19.5037945,15.373208 19.0719178,15.2238737 C18.6400411,15.0746672 18.2164247,15 17.8013151,15 C16.301274,15 15.1260959,15.4306148 14.2756575,16.2917166 C13.4252192,17.1528184 13,18.3472375 13,19.874974 C13,20.3402375 13.0787808,20.819565 13.2360959,21.3124451 C13.393411,21.805453 13.5726712,22.2257116 13.7735068,22.5728373 C13.9743425,22.9199629 14.2020548,23.2586502 14.4565205,23.5885154 C14.7109863,23.9183807 14.8969041,24.1457065 15.0140274,24.2707484 C15.1311507,24.3956625 15.2232466,24.485928 15.2901918,24.541417 L21.5580137,30.8123092 C21.678589,30.937479 21.8259178,31 22,31 C22.1740822,31 22.321411,30.937479 22.4419863,30.8125649 L28.6998219,24.5623851 C30.233274,22.9722555 31,21.4097425 31,19.874974 C31,18.3472375 30.5746575,17.1528184 29.7242192,16.2917166 C28.8737808,15.430487 27.6986027,15 26.1984384,15 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="apple" transform="translate(40.000000, 460.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-142)" stroke-width="4" xlink:href="#path-141"></use>
                        <path
                            d="M31,26.1409957 C30.5097917,27.2856095 30.2733093,27.7951891 29.6402262,28.8091747 C28.7571122,30.2215118 27.5106529,31.9830532 25.9661273,31.9959867 C24.5952684,32.0102135 24.2430081,31.0583086 22.3807092,31.0699488 C20.5208737,31.0802956 20.1316631,32.0128002 18.7595725,31.9998667 C17.2162785,31.9856399 16.0363299,30.3961139 15.1519842,28.9824835 C12.6812358,25.0325956 12.4213515,20.394646 13.9461703,17.9282294 C15.030048,16.1770349 16.738387,15.1527025 18.3457283,15.1527025 C19.9801665,15.1527025 21.0086186,16.0942605 22.362234,16.0942605 C23.6739723,16.0942605 24.4733321,15.1501158 26.3651913,15.1501158 C27.7964025,15.1501158 29.3113679,15.9688057 30.3903188,17.3811428 C26.8529363,19.4181675 27.4268988,24.7208985 31,26.1409957 L31,26.1409957 Z M24.9315168,13.5709366 C25.6175621,12.6448987 26.139794,11.3360295 25.9513471,10 C24.8280557,10.0801876 23.5138541,10.8316234 22.7477496,11.8093953 C22.0506192,12.6953393 21.4766567,14.013262 21.6995907,15.2936775 C22.9288065,15.3337713 24.1962043,14.5642287 24.9315168,13.5709366 L24.9315168,13.5709366 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="android" transform="translate(100.000000, 460.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-144)" stroke-width="4" xlink:href="#path-143"></use>
                        <path
                            d="M24.8164998,12.8418391 L25.0463928,12.4822415 L25.2738005,12.127818 L25.7845357,11.3310118 C25.846669,11.2327046 25.8218157,11.1007659 25.7273731,11.03609 C25.6329306,10.9701207 25.5061788,10.9972846 25.4440456,11.0955918 L24.897273,11.9493127 L24.6661374,12.3076168 L24.4337591,12.6723884 C23.6943735,12.3735861 22.8704867,12.2067225 21.9993787,12.2067225 C21.130756,12.2067225 20.3056265,12.3735861 19.5674836,12.6723884 L19.3338626,12.3076168 L19.1052123,11.9493127 L18.5571971,11.0955918 C18.4938212,10.9972846 18.368312,10.9714142 18.2738695,11.03609 C18.179427,11.1007659 18.1545737,11.2327046 18.2167069,11.3310118 L18.7261995,12.127818 L18.9536072,12.4822415 L19.1847428,12.8418391 C17.4474974,13.6839183 16.2731792,15.2788241 16.2731792,17.1039759 L27.7268208,17.1039759 C27.7268208,15.2788241 26.5525026,13.6839183 24.8164998,12.8418391 L24.8164998,12.8418391 Z M19.5463583,15.4004147 C19.2058681,15.4004147 18.9324819,15.1145475 18.9324819,14.7614175 C18.9324819,14.4082875 19.2058681,14.1237139 19.5463583,14.1237139 C19.8843631,14.1237139 20.1589921,14.4082875 20.1589921,14.7614175 C20.1589921,15.1145475 19.8843631,15.4004147 19.5463583,15.4004147 L19.5463583,15.4004147 Z M24.4536417,15.4004147 C24.1156369,15.4004147 23.8410079,15.1145475 23.8410079,14.7614175 C23.8410079,14.4082875 24.1156369,14.1237139 24.4536417,14.1237139 C24.7941319,14.1237139 25.0675181,14.4082875 25.0675181,14.7614175 C25.0675181,15.1145475 24.7941319,15.4004147 24.4536417,15.4004147 Z M16.3614084,17.9551097 L16.2731792,17.9551097 L16.2731792,27.3227561 C16.2731792,28.0665281 16.8547463,28.6718938 17.5692786,28.6718938 L18.5037625,28.6718938 C18.4726959,28.7844298 18.4552986,28.9021398 18.4552986,29.0263174 L18.4552986,31.7232992 C18.4552986,32.4282657 19.0045564,33 19.6818088,33 C20.3590611,33 20.9108043,32.4282657 20.9108043,31.7232992 L20.9108043,29.0263174 C20.9108043,28.9021398 20.8921643,28.7844298 20.8610977,28.6718938 L23.140145,28.6718938 C23.1078357,28.7844298 23.091681,28.9021398 23.091681,29.0263174 L23.091681,31.7232992 C23.091681,32.4282657 23.6409389,33 24.3181912,33 C24.9966862,33 25.5459441,32.4282657 25.5459441,31.7232992 L25.5459441,29.0263174 C25.5459441,28.9021398 25.5273041,28.7844298 25.4962375,28.6718938 L26.4319641,28.6718938 C27.1464964,28.6718938 27.7268208,28.0665281 27.7268208,27.3227561 L27.7268208,17.9551097 L16.3614084,17.9551097 Z M14.2289955,17.9551097 C13.5505005,17.9551097 13,18.526844 13,19.2318105 L13,24.6969177 C13,25.4018842 13.5505005,25.9736184 14.2289955,25.9736184 C14.9062478,25.9736184 15.4555057,25.4018842 15.4555057,24.6969177 L15.4555057,19.2318105 C15.4555057,18.526844 14.9062478,17.9551097 14.2289955,17.9551097 Z M29.7722472,17.9551097 C29.0949948,17.9551097 28.5444943,18.526844 28.5444943,19.2318105 L28.5444943,24.6969177 C28.5444943,25.4018842 29.0949948,25.9736184 29.7722472,25.9736184 C30.4494995,25.9736184 31,25.4018842 31,24.6969177 L31,19.2318105 C31,18.526844 30.4494995,17.9551097 29.7722472,17.9551097 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="googleplay" transform="translate(160.000000, 460.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-146)" stroke-width="4" xlink:href="#path-145"></use>
                        <path
                            d="M26.8355771,22.3820031 L16.1452182,32.6997109 L16.1319691,32.7125919 L15.8239277,33 C16.2950985,32.7351338 25.2398899,27.7219966 25.2398899,27.7219966 L29.7429241,25.1828228 L29.6013244,25.0580378 L26.8355771,22.3820031 Z M30.2960736,19.0546712 L30.2323123,19.1174662 L30.2190632,19.1174662 L30.1163828,19.2301753 L28.8038949,20.4933216 L27.4019756,21.84422 L27.3754775,21.857101 L27.3754775,21.8683719 L27.272797,21.956929 L30.1163828,24.7078347 L30.2190632,24.8205438 L30.2323123,24.8205438 L30.2960736,24.8825338 L34.6061679,22.4568742 C35.0773387,22.1920079 35.105493,21.8369744 34.7982797,21.5938449 C34.7767499,21.5761335 34.7469395,21.5600322 34.7212694,21.5439309 L34.6442591,21.4932118 C34.2186321,21.271014 30.7730408,19.3227577 30.2960736,19.0546712 L30.2960736,19.0546712 Z M15.1291786,11.099828 C15.0521683,11.2012661 15,11.3437626 15,11.5257072 L15,21.969005 L15,32.6127639 C15,32.725473 15.024842,32.8220807 15.0645893,32.8993669 L15.0778384,32.888096 L15.0902594,32.888096 L15.2318591,32.7375489 L26.3983571,21.956929 L26.3080977,21.8683719 L26.2956767,21.8683719 L26.2567575,21.84422 L15.2956203,11.2503751 L15.1805188,11.137666 L15.1283506,11.099828 L15.1291786,11.099828 Z M15.9009381,11 L16.119548,11.2004611 L16.1452182,11.2262231 L16.1576392,11.2262231 L26.8355771,21.5439309 L27.9675461,20.4554836 L29.6013244,18.8791671 L29.7429241,18.7543821 L25.2398899,16.2160135 L16.0168676,11.037838 C16.0044466,11.0305925 15.9903694,11.0313975 15.9779484,11.0257621 C15.9522783,11.012076 15.9257801,11.0112709 15.9009381,11 L15.9009381,11 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="windows" transform="translate(220.000000, 460.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-148)" stroke-width="4" xlink:href="#path-147"></use>
                        <path
                            d="M21.2553597,13.5681448 L21.2553597,21.4485688 L31,21.4485688 L31,12 L21.2553597,13.5681448 Z M21.2553597,30.4318552 L31,32 L31,22.5514312 L21.2553597,22.5514312 L21.2553597,30.4318552 Z M13,21.4485688 L20.2613149,21.4485688 L20.2613149,13.7269443 L13,14.8957084 L13,21.4485688 Z M13,29.1034976 L20.2613149,30.2722617 L20.2613149,22.5514312 L13,22.5514312 L13,29.1034976 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="amazon" transform="translate(280.000000, 460.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-150)" stroke-width="4" xlink:href="#path-149"></use>
                        <path
                            d="M10.2170651,27.7723269 C10.0118094,27.7575213 9.90728811,28.0536319 10.107242,28.2819488 C13.2398524,31.8516398 17.373747,34 21.9726857,34 C25.2529893,34 29.0642311,32.6916588 31.6924125,30.2479672 C32.127918,29.8404255 31.7567915,29.237295 31.3129546,29.4765212 C28.3674222,31.0536997 25.1643734,31.8126779 22.2536815,31.8126779 C17.9349811,31.8126779 13.7526129,30.3212156 10.3723323,27.8393414 C10.317042,27.7980417 10.2647814,27.7762231 10.2170651,27.7723269 M32.2377412,27.1801057 C31.3977835,27.1956905 30.4025586,27.4302412 29.6512168,28.09649 C29.4194521,28.3006505 29.458837,28.5842933 29.7163533,28.5445521 C30.5631276,28.4175363 32.452843,28.1315558 32.7883717,28.6731264 C33.1246577,29.2170348 32.414973,31.4526697 32.0983794,32.4508741 C32.0014321,32.7539978 32.2059303,32.8802344 32.422547,32.6519176 C33.8350998,31.1635723 34.1956227,28.047398 33.9085677,27.5969982 C33.7646615,27.3733568 33.0776988,27.1660794 32.2377412,27.1801057 M23.6533585,20.1396869 L23.6533585,20.8043773 C23.6533585,21.999729 23.6859267,22.9940371 23.098941,24.056139 C22.6240505,24.9203144 21.8719514,25.4509757 21.0319937,25.4509757 C19.8868034,25.4509757 19.2218053,24.5532931 19.2218053,23.2278086 C19.2218053,20.6119054 21.4970379,20.1396869 23.6533585,20.1396869 M22.0378222,11 C19.2005981,11 16.0323898,12.088596 15.3651196,15.6988074 C15.2977109,16.0829719 15.5665882,16.2855739 15.8104713,16.3416791 L18.7014709,16.6603876 C18.9703482,16.6479198 19.1710595,16.3759656 19.2218053,16.1001152 C19.4694755,14.8564507 20.4859076,14.2572164 21.6227664,14.2572164 C22.2355038,14.2572164 22.9285257,14.4894295 23.293593,15.0551565 C23.7086487,15.6855604 23.6533585,16.5489565 23.6533585,17.2783236 L23.6533585,17.674956 C21.9249694,17.8775579 19.6663997,18.0115869 18.046319,18.7456295 C16.1785682,19.5739599 14.8644775,21.2664656 14.8644775,23.75847 C14.8644775,26.9486719 16.8170572,28.5445521 19.3263267,28.5445521 C21.450079,28.5445521 22.6119321,28.0294755 24.2486756,26.3104757 C24.7947617,27.1177666 24.9697214,27.5128405 25.9596445,28.3590934 C26.1823203,28.4798753 26.4678605,28.468966 26.6655422,28.2866242 L26.674631,28.2920789 C27.2714629,27.7481705 28.3522741,26.7764602 28.9612245,26.2543705 C29.2043502,26.0470931 29.1649654,25.716696 28.9718281,25.4408456 C28.425742,24.663945 27.8455729,24.0327619 27.8455729,22.5942878 L27.8455729,17.808985 C27.8455729,15.7837444 27.9819051,13.9229232 26.5299674,12.5280865 C25.3840197,11.3966323 23.4897599,11 22.0378222,11"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="dropbox" transform="translate(340.000000, 460.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-152)" stroke-width="4" xlink:href="#path-151"></use>
                        <path
                            d="M11,23.6907216 L17.4714252,28.0259313 L22,24.1489469 L15.4742474,20.0129657 L11,23.6907216 Z M17.4714252,12 L11,16.3338815 L15.4742474,20.0129657 L22,15.8783126 L17.4714252,12 Z M33,16.3338815 L26.5285748,12 L22,15.8783126 L28.5257526,20.0129657 L33,16.3338815 Z M22,24.1489469 L26.5285748,28.0259313 L33,23.6907216 L28.5257526,20.0129657 L22,24.1489469 Z M22.0129351,24.9830498 L17.4714252,28.8507368 L15.5285748,27.5477832 L15.5285748,29.0087913 L22.0129351,33 L28.4985889,29.0087913 L28.4985889,27.5477832 L26.5557385,28.8507368 L22.0129351,24.9830498 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="googledrive" transform="translate(400.000000, 460.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-154)" stroke-width="4" xlink:href="#path-153"></use>
                        <path
                            d="M18.736477,26.1726908 L18.6148871,26.1726908 L18.5553857,26.2824632 L15.5751411,31.6746988 L15.3940499,32 L29.7791627,32 L29.8399577,31.8915663 L32.8189087,26.4993307 L33,26.1726908 L18.736477,26.1726908 Z M26.4522578,24.8099063 L26.5143462,24.9196787 L26.635936,24.9196787 L32.6378175,24.892905 L33,24.8915663 L32.8189087,24.5662651 L25.8688852,12.1097724 L25.8080903,12 L25.687794,12 L19.684619,12.0254351 L19.3224365,12.0281124 L19.5022342,12.352075 L26.4522578,24.8099063 Z M21.4593133,18.476573 L21.3985183,18.3668005 L18.3742944,13.0013387 L18.1932032,12.6773762 L18.0121119,13.0013387 L11.0620884,25.45917 L11,25.5689424 L11.0620884,25.6773762 L14.0850188,31.0455154 L14.2661101,31.3681392 L14.4484948,31.0441767 L21.3985183,18.5850067 L21.4593133,18.476573 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="sketch" transform="translate(520.000000, 460.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-158)" stroke-width="4" xlink:href="#path-157"></use>
                        <path
                            d="M34.0789945,16.7614444 L30.2358094,13.8499259 C30.1496242,13.7594074 30.0523649,13.6852593 29.945476,13.6303704 L27.3565501,11.6688148 C27.1639575,11.5234074 26.929476,11.4444444 26.6882538,11.4444444 L16.8304019,11.4444444 C16.5891797,11.4444444 16.3542168,11.5234074 16.1621057,11.6688148 L9.43917973,16.7614444 C8.95047602,17.1317037 8.85514269,17.8288889 9.22636491,18.3171111 L20.8777353,33.6368889 C21.3211797,34.219963 22.1969945,34.219963 22.640439,33.6368889 L34.2922908,18.3171111 C34.6635131,17.8288889 34.5676982,17.1317037 34.0789945,16.7614444 L34.0789945,16.7614444 Z M17.2021057,13.6621481 L26.3165501,13.6621481 L27.5717723,14.6130741 L25.9472538,15.8158148 L18.0134019,15.7532222 L16.0099575,14.5649259 L17.2021057,13.6621481 L17.2021057,13.6621481 Z M18.2912168,17.9728519 L25.7373279,18.0320741 L27.8284019,20.9445556 L16.2863279,20.9445556 L18.2912168,17.9728519 L18.2912168,17.9728519 Z M14.1018464,16.0103333 L16.1303279,17.2135556 L13.799476,20.6691481 L11.6616982,17.8587407 L14.1018464,16.0103333 L14.1018464,16.0103333 Z M21.7593279,31.1351111 L15.6955501,23.1622593 L27.8231057,23.1622593 L21.7593279,31.1351111 L21.7593279,31.1351111 Z M30.0480316,20.2367778 L27.8452538,17.1687778 L29.4129575,16.0074444 L31.856476,17.8587407 L30.0480316,20.2367778 L30.0480316,20.2367778 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                    <g id="web" transform="translate(580.000000, 460.000000)">
                        <rect id="Rectangle" x="0" y="0" width="44" height="44"></rect>
                        <use id="Oval" stroke="#000000" mask="url(#mask-160)" stroke-width="4" xlink:href="#path-159"></use>
                        <path
                            d="M22,11 C15.923875,11 11,15.92525 11,22 C11,28.07475 15.923875,33 22,33 C28.07475,33 33,28.07475 33,22 C33,15.92525 28.07475,11 22,11 L22,11 Z M22,31.625 C20.647,31.625 19.358625,31.345875 18.19125,30.84125 L23.200375,25.2065 C23.31175,25.08 23.375,24.91775 23.375,24.75 L23.375,22.6875 C23.375,22.309375 23.065625,22 22.6875,22 C20.25925,22 17.697625,19.476875 17.672875,19.452125 C17.545,19.3215 17.370375,19.25 17.1875,19.25 L14.4375,19.25 C14.058,19.25 13.75,19.559375 13.75,19.9375 L13.75,24.0625 C13.75,24.322375 13.89575,24.561625 14.128125,24.677125 L16.5,25.862375 L16.5,29.899375 C14.00575,28.161375 12.375,25.271125 12.375,22 C12.375,20.52325 12.706375,19.124875 13.30175,17.875 L15.8125,17.875 C15.995375,17.875 16.17,17.802125 16.297875,17.67425 L19.047875,14.92425 C19.177125,14.795 19.25,14.620375 19.25,14.4375 L19.25,12.77375 C20.12175,12.51525 21.044375,12.375 22,12.375 C23.5125,12.375 24.943875,12.72425 26.21575,13.34575 C26.12775,13.421375 26.03975,13.49975 25.958625,13.58225 C25.177625,14.361875 24.75,15.39725 24.75,16.498625 C24.75,17.6 25.177625,18.638125 25.958625,19.415 C26.739625,20.197375 27.790125,20.623625 28.870875,20.623625 C28.939625,20.623625 29.008375,20.62225 29.077125,20.618125 C29.37275,21.731875 29.909,24.629 28.897,28.6165 C28.887375,28.655 28.881875,28.6935 28.879125,28.730625 C27.130125,30.515375 24.696375,31.623625 22.001375,31.623625 L22,31.625 L22,31.625 Z"
                            id="Shape"
                            fill="#000000"
                        ></path>
                    </g>
                </g>
            </g>
        </svg> -->

        <router-view />
    </div>
</template>
<script>
export default {
    data() {
        return {
            debugMode: false
        };
    },
    components: {},
    computed: {
        layout() {
            return `${this.$route.meta.layout || 'default'}-layout`;
        }
    },
    methods: {},

    watch: {},

    created() {
        //Ctrl + F12 Debug Toggle Listener
        window.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'F12') {
                this.debugMode = !this.debugMode;
            }
        });
    },
    mounted() {
        document.title = 'Grave Night';
    }
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}

#header {
    width: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    background: darkgrey;
    background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 1) 5%,
        rgba(50, 50, 50, 1) 20%,
        rgba(60, 60, 60, 1) 65%,
        rgba(50, 50, 50, 1) 85%,
        rgba(0, 0, 0, 1) 100%
    );
}

#GNsvg {
    text-align: left;
    vertical-align: bottom;
    /* margin: 40px 5px; */
}

/* @font-face {
  font-family: myFirstFont;
  src: url(sansation_light.woff);
} */

body {
    color: #00488f;
    background: #000;
}

#nav {
    font-size: 50px;
    padding: 30px;
    vertical-align: middle;
}

#nav a {
    font-weight: bold;
    color: #6e6e6e;
}

#nav a.router-link-exact-active {
    color: lightGrey;
}
</style>
