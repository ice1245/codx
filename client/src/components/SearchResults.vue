<template>
  <div class="flex flex-col" v-if="search">
    <div class="navbar mb-2 shadow-lg" v-if="!showWelcome">
      <div class="flex-1 px-2 mx-2">
        <span class="text-lg font-bold">{{ search.topic }}</span>
      </div>
      <div class="flex-none hidden px-2 mx-2 lg:flex">
        <div class="flex items-stretch">
          <a class="btn btn-ghost btn-sm rounded-btn"
            @click="newCodingClinic = !newCodingClinic">
            <PlusCircleIcon class="inline-block w-5 mr-2 stroke-current" />
                New...
          </a> 
          <a class="btn btn-ghost btn-sm rounded-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 mr-2 stroke-current">              
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>            
            </svg>
                  Likes
          </a> 
          <a class="btn btn-ghost btn-sm rounded-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 mr-2 stroke-current">     
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>                     
            </svg>
                  Notifications
          </a> 
          <a class="btn btn-ghost btn-sm rounded-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 mr-2 stroke-current">          
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>                
            </svg>
                  Files
          </a>
        </div>
      </div> 
      <div class="flex-none">
        <button class="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">           
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>               
          </svg>
        </button>
      </div>
    </div>

    <div class="flex items-center w-full px-4 py-10 bg-cover bg-base-200"
      :style="`background-image: url('${search.banner.bgImage}');`"
      v-else
    >
      <div class="card glass lg:card-side text-neutral-content">
        <figure class="p-6">
          <img :src="search.banner.image" class="shadow-lg" style="width:300px">
        </figure> 
        <div class="max-w-md card-body">
          <h2 class="card-title">{{ search.topic }}</h2> 
          <p>{{ search.description }}</p> 
          <div class="card-actions">
            <button class="btn glass rounded-full" @click="showWelcome = false" >Get Started</button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-2">
      <button
        v-for="(tag, ix) in search.tags" :key="ix"
        :class="`mr-2 btn btn-${labelColors[ix]}`">
        {{ tag }} 
      </button> 
    </div>

    <div class="p-2 grid grid-cols-4 gap-5 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100">
      <div class="bg-base-100 text-base-content card rounded h-80 mr-4 cursor-pointer"
        v-for="(result, ix) in search.results" :key="ix"
        @click="resultDialog = result"
      >
        <div class="h-40 carousel rounded-box">
          <div class="w-full carousel-item"
            v-for="(mhtml, iix) in getResultMedia(result)" :key="iix"
            >
            <div v-html="mhtml" class="w-full"></div>
          </div>
        </div>
        <div class="p-2 w-full text-base-content">
          <div class="flex flex-row w-full">
            <Avatar size="12" :url="result.user.avatar" />
            <div class="ml-4 flex flex-col w-full">
              <div class="flex flex-row justify-between w-full">
                <strong>{{ `@${result.user.username}` }}</strong>
                <div class="flex flex-row mr-2">
                  <ThumbUpIcon class="w-4" /> {{ result.likeCount }}
                  <ThumbDownIcon class="ml-2 w-4" /> {{ result.dislikeCount }}
                </div>
              </div>
              <small>Category 4*</small>
            </div>
          </div>
          <p class="prose">
            <span>
              {{ result.description }}
            </span>
          </p>
          <div class="flex justify-end w-full gap-2 mt-1">
            <button class="btn btn-sm bg-accent text-accent-content drop-shadow-md"
              @click="runClinicTemplate(result)"
            >
              <TerminalIcon class="w-4 mr-1" /> Run
            </button>
          </div>
        </div>
      </div> 
    </div>
    <CodingClinicDialog
      v-if="newCodingClinic"
      @ok="onNewCodingClinic"
      @cancel="newCodingClinic = false"
    />
    <Dialog
      v-if="resultDialog"
      @close="resultDialog = null"
      @ok="resultDialog = null"
      :btns="['ok']"
    >
      <template v-slot:icon>
        <Avatar size="12" :url="resultDialog.user.avatar" />
      </template>
      <div class="max-w-lg p-4 space-x-4 carousel carousel-center bg-neutral rounded-box">
        <div class="w-full carousel-item"
          v-for="(mhtml, iix) in getResultMedia(resultDialog)" :key="iix"
          >
          <div v-html="mhtml" class="w-full"></div>
        </div>
      </div>
      <div class="flex flex-row w-full">
        <div class="ml-4 flex flex-col w-full">
          <div class="flex flex-row justify-between w-full">
            <strong>{{ `@${resultDialog.user.username}` }}</strong>
            <div class="flex flex-row mr-2">
              <ThumbUpIcon class="w-4" /> {{ resultDialog.likeCount }}
              <ThumbDownIcon class="ml-2 w-4" /> {{ resultDialog.dislikeCount }}
            </div>
          </div>
          <small>Category 4*</small>
        </div>
      </div>
      <p class="prose">
        <span>
          {{ resultDialog.description }}
        </span>
      </p>
    </Dialog>
  </div>
</template>
<script>
import {
  ThumbUpIcon,
  ThumbDownIcon,
  PlayIcon,
  TerminalIcon,
  PlusCircleIcon,
  CogIcon
} from '@heroicons/vue/outline'
import Avatar from '@/components/Avatar.vue'
import CodingClinicDialog from '@/components/CodingClinicDialog.vue'
import Dialog from '@/components/Dialog.vue'

export default {
  components: {
    Avatar,
    ThumbUpIcon,
    ThumbDownIcon,
    PlayIcon,
    TerminalIcon,
    PlusCircleIcon,
    CogIcon,
    CodingClinicDialog,
    Dialog
  },
  data () {
    return {
      newCodingClinic: false,
      labelColors: [
        'primary',
        'secondary',
        'info',
        'warning',
        'teal'
      ],
      showWelcome: true,
      resultDialog: null
    }
  },
  computed: {
    search () {
      const { currentSearch } = this.$storex.search
      if (!currentSearch) {
        return null
      }
      // const { results } = currentSearch
      const results = [
        'https://i.ytimg.com/vi/rfscVS0vtbw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLABBQtpk83-Gm8-IgPAiGlTtrLH9w',
        'https://i.ytimg.com/vi/wDIQ17T3sRk/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCUasho5kBu25lowid1F5e9pfTyNw',
        'https://i.ytimg.com/vi/esX7SFtEjHg/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCD8mvtnRms6oId-LL62pB7mRz-zw',
        'https://i.ytimg.com/an_webp/wDIQ17T3sRk/mqdefault_6s.webp?du=3000&sqp=CNT3yo8G&rs=AOn4CLA_r_N-3ERl_ElTSRSpu12TL5K9vQ',
        'https://i.ytimg.com/vi/I-k-iTUMQAY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLA8to4KTlPsGQyiaLFEV7KR61Bxkw',
        'https://i.ytimg.com/vi/N7ZmPYaXoic/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDT6u4Jv1G8JZc6I_9Km5PSU5IZFQ',
        'https://i.ytimg.com/vi/5HaJPpihkBI/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCCFqj15e1jOCiE-QPhBTYviLpm5A',
        'https://i.ytimg.com/vi/MHPGeQD8TvI/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDzKmd7-5BsioY2Vae3I3maYFvMHA',
        'https://i.ytimg.com/vi/l9nh1l8ZIJQ/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLC5dy2pAHtpEK6aS2vkixXIZlGwkQ',
        'https://i.ytimg.com/vi/kbKty5ZVKMY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLD9ig7IJeWqwDLhRpeJrlPYy0GkaQ',
        'https://i.ytimg.com/an_webp/MHPGeQD8TvI/mqdefault_6s.webp?du=3000&sqp=CLbiyo8G&rs=AOn4CLDAK5Gh3IkMPJolZ8Bpn-whYm6zVA',
        'https://i.ytimg.com/vi/hb7Q33ysCwI/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDnhyhqR0LolwC_2pkPEcXuI4jwkw'
      ].map(i => {
          return {
            ...currentSearch.results[0],
            media: [
              {
                "type": "image",
                "url": i
              },
            ]
          }
        })
      
      return {
        topic: '#coding-clinic',
        description: 'Find developers to connect and work together in an online development environment. A coding clinic is a timeboxed session where two or more participants will collaborate to solve a problem',
        banner: {
          bgImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZ3JhbW1pbmd8ZW58MHx8MHx8&w=1000&q=80',
          image: 'https://careertraining.ed2go.com/common/images/2/22516/GES375-agnesscott-Full-Stack-Software-Developer-935x572.jpg'
        },
        showWelcome: true,
        tags: results.map(r => r.tags.split(" "))
              .reduce((a, b) => a.concat(b), [])
              .filter((v, ix, arr) => arr.indexOf(v) === ix),
        results: [...currentSearch.results, ...results]
      }
    }
  },
  created () {
    this.$storex.search.doSearch()
  },
  methods: {
    onNewCodingClinic (template) {
      this.newCodingClinic = false
      console.log(template)
    },
    getResultMediaVideos (result) {
      return this.getResultMedia({
        ...result,
        media: result.media.filter(({ type }) => type === 'youtube')
      })
    },
    getResultMedia (result) {
      return (result.media||[]).map(({ type, url }) => {
        if (type === 'image') {
          return `<img src="${url}" class="w-full h-full" />`
        }
        if (type === 'youtube') {
          return `<iframe src="${url}"
            class="w-full h-full"
            title="YouTube video player"
            frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`
        }
      }).filter(r => !!r)
    },
    resultHasVideo (result) {
      return result.media.some(({ type }) => type === 'youtube' )
    },
    runClinicTemplate (result) {
      this.$emit('new-clinic', result)
    }
  }
}
</script>