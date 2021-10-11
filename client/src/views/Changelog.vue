<template>
    <div class="changelog">
        <div class="header">
            <h2>Change Log</h2>
        </div>
        <el-divider></el-divider>

        <p>Grave: Meriting serious consideration. Likely to produce great harm or danger. Significantly Serious.</p>
        <p>Night: The time from dusk to dawn when no sunlight is visible. The quality or state of being dark.</p>

        <el-divider></el-divider>

        <div class="changelogDiv">
            <el-card v-for="(commit, index) in commits" :key="index" shadow="never" class="changeLogCard">
                <ul>
                    <!-- <li>Author:{{ commit.commiter.name }}</li> -->
                    <li>{{ DateTime.fromISO(new Date(commit.commiter.date).toISOString()).toFormat('ff') }}</li>
                    <li>{{ commit.subject }}</li>
                    <!-- <li>Sanitized:{{ commit.sanitized_subject_line }}</li> -->
                    <!-- <li>Body:{{ commit.body }}</li>
                    <li>Notes{{ commit.commit_notes }}</li> -->
                </ul>
            </el-card>
        </div>
    </div>
</template>
<script>
import { DateTime } from 'luxon';

//git log --pretty=format:'{%n "subject": "%s",%n  "sanitized_subject_line": "%f",%n  "body": "%b",%n  "commit_notes": "%N",%n  "author": {%n    "name": "%aN",%n  "date": "%aD"%n  },%n  "commiter": {%n  "name": "%cN",%n  "date": "%cD"%n  }%n},' >> output.json

export default {
    data() {
        return {
            DateTime: DateTime,
            commits: [
                {
                    subject: 'Pixi Tiling backgound with spritesheet. ghost cursor working again. snapping needs reworked.',
                    commiter: {
                        name: 'd.welborn',
                        date: 'Monday, 11 Oct 2021 00:34:00 -0400'
                    }
                },
                {
                    subject: 'Pixi is coming along nicely. Moved buttons and HUD, energy packets working again. Save and Restore working.',
                    commiter: {
                        name: 'd.welborn',
                        date: 'Sunday, 10 Oct 2021 00:27:00 -0400'
                    }
                },
                {
                    subject: 'started replacing graphics with Pixi. Get some basic camera translation working',
                    commiter: {
                        name: 'd.welborn',
                        date: 'Wednesday, 6 Oct 2021 11:55:00 -0400'
                    }
                },
                {
                    subject: 'Created Discord Server, linked to website and invited some friends',
                    commiter: {
                        name: 'd.welborn',
                        date: 'Thursday, 30 Sep 2021 10:05:00 -0400'
                    }
                },
                {
                    subject: 'Researching and learning about PixiJS, deciding if it is a good fit as a Render Library to leverage WebGL',
                    commiter: {
                        name: 'd.welborn',
                        date: 'Wednesday, 29 Sep 2021 10:05:00 -0400'
                    }
                },
                {
                    subject:
                        'Zoom Fixed, started testing with lighting. camera zoom to mouse, mouse snap to center of screen to stay on target',
                    commiter: {
                        name: 'd.welborn',
                        date: 'Monday, 27 Sep 2021 23:05:00 -0400'
                    }
                },
                {
                    subject: 'working on render distance optimisation for reducing number of drawn entities. reworking zoom again.',
                    commiter: {
                        name: 'd.welborn',
                        date: 'Sunday, 26 Sep 2021 23:13:00 -0400'
                    }
                },
                {
                    subject:
                        'Reworked State to be a single Object, no class instances. Reworked EnergyNode and hud to work with new state style. Saving and loading from localstorage of gamestate. removed backgroun sprites until backgroun rework. reworked many functions to re-use temp memory variables instead of allocating new memory to optimise Garbage collector. Re-use energy packet memory references. This removed the huge framerate drops on Non-incremental GC events lasting 1-2 seconds.',
                    commiter: {
                        name: 'd.welborn',
                        date: 'Sunday, 26 Sep 2021 1:50:00 -0400'
                    }
                },
                {
                    subject: 'Main Title on Home page, flashlight purity effect.',
                    commiter: {
                        name: 'd.welborn',
                        date: 'Thur, 24 Sep 2021 0:05:00 -0400'
                    }
                },
                {
                    subject: 'Finished Logo, added changelog git commit logs, social logos',
                    commiter: {
                        name: 'd.welborn',
                        date: 'Thur, 23 Sep 2021 1:00:00 -0400'
                    }
                },
                {
                    subject: 'workin on integrating logo into site',
                    commiter: {
                        name: 'd.welborn',
                        date: 'Wed, 22 Sep 2021 17:13:01 -0400'
                    }
                },
                {
                    subject: 'some logos, fonts and links added',
                    commiter: {
                        name: 'd.welborn',
                        date: 'Tue, 21 Sep 2021 17:06:19 -0400'
                    }
                },
                {
                    subject:
                        'snapping is working pretty well. Would like autoplace when holding mouse and moving out of snap area, but might be tricky. need rework for states to be able to save/restore, and interpolate frames. in the future also for sending to multiplayer clients',
                    commiter: {
                        name: 'welbordn',
                        date: 'Sat, 18 Sep 2021 23:50:26 -0400'
                    }
                },
                {
                    subject: 'maybe more work on background',
                    commiter: {
                        name: 'd.welborn',
                        date: 'Fri, 17 Sep 2021 17:11:01 -0400'
                    }
                },
                {
                    subject: 'YUUUUUSS, zooming seems to be working so far',
                    commiter: {
                        name: 'd.welborn',
                        date: 'Fri, 17 Sep 2021 16:40:02 -0400'
                    }
                },
                {
                    subject: 'fixed issue with background not rerendering on zoom',
                    commiter: {
                        name: 'd.welborn',
                        date: 'Wed, 15 Sep 2021 16:54:36 -0400'
                    }
                },
                {
                    subject:
                        'still working on scaling/zooming, translate functions need work. cleaning up gargage collector issues on the way',
                    commiter: {
                        name: 'welbordn',
                        date: 'Tue, 14 Sep 2021 23:48:46 -0400'
                    }
                },
                {
                    subject: 'cursor lock',
                    commiter: {
                        name: 'd.welborn',
                        date: 'Tue, 14 Sep 2021 17:05:39 -0400'
                    }
                },
                {
                    subject: 'setup prod test to remove debugs',
                    commiter: {
                        name: 'welbordn',
                        date: 'Mon, 13 Sep 2021 22:46:47 -0400'
                    }
                },
                {
                    subject: 'working on zoom, especialy camera movement',
                    commiter: {
                        name: 'welbordn',
                        date: 'Mon, 13 Sep 2021 22:38:50 -0400'
                    }
                },
                {
                    subject: 'packets not move between energy nodes. working on zooming',
                    commiter: {
                        name: 'd.welborn',
                        date: 'Mon, 13 Sep 2021 17:02:40 -0400'
                    }
                },

                {
                    subject: 'added keyboard shortcut for buttons, lines for links when ghost constructing, working on energy packets',
                    commiter: {
                        name: 'welbordn',
                        date: 'Sun, 12 Sep 2021 22:30:40 -0400'
                    }
                },
                {
                    subject: 'hud cursor mode, new statemanager, energynode entity type',
                    commiter: {
                        name: 'welbordn',
                        date: 'Sat, 11 Sep 2021 16:05:39 -0400'
                    }
                },

                {
                    subject: 'added buttons with callback events',
                    commiter: {
                        name: 'welbordn',
                        date: 'Mon, 6 Sep 2021 22:39:23 -0400'
                    }
                },
                {
                    subject: 'making all client, wrapping in vue',
                    commiter: {
                        name: 'welbordn',
                        date: 'Mon, 30 Aug 2021 08:19:18 -0400'
                    }
                },
                {
                    subject: 'completely rework gravenight, differnt game direction, add vue to client',
                    commiter: {
                        name: 'welbordn',
                        date: 'Sun, 22 Aug 2021 22:00:11 -0400'
                    }
                }
            ]
        };
    },
    components: {},
    methods: {},
    watch: {},
    created() {},
    mounted() {}
};
</script>

<style scoped>
.changelogDiv {
    display: inline;
    text-align: center;
}
.changeLogCard {
    width: 50%;
    background-color: black !important;
    box-shadow: 0 2px 12px 0 rgb(255, 255, 255) !important;
    color: white;
    margin: 0 auto;
}
</style>
