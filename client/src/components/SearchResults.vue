<template>
  <div class="flex flex-col">

    <div class="navbar mb-2 shadow-lg" v-if="!search.showWelcome">
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
            <button class="btn glass rounded-full" @click="search.showWelcome = false" >Get Started</button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-2">
      <button
        v-for="(tag, ix) in search.tags" :key="ix"
        :class="`mr-2 btn btn-${labelColors[ix]}`">
        {{ tag.label }} 
        <div class="badge ml-2 badge-outline">{{ tag.count }}</div>
      </button> 
    </div>

    <div class="p-2 grid grid-cols-4 gap-5 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100">
      <div class="bg-base-100 text-base-content card rounded h-64 mr-4"
        v-for="(result, ix) in search.results" :key="ix"
      >
        <img :src="images[ix]" class="h-1/2 drop-shadow-md">
        <div class="p-2 w-full h-full text-base-content">
          <div class="flex flex-row w-full">
            <Avatar size="12" url="https://avatars.dicebear.com/api/open-peeps/test.svg" />
            <div class="ml-4 flex flex-col w-full">
              <div class="flex flex-row justify-between w-full">
                <strong>@username</strong>
                <div class="flex flex-row mr-2">
                  <ThumbUpIcon class="w-4" /> 100
                  <ThumbDownIcon class="ml-2 w-4" /> 6
                </div>
              </div>
              <small>Category 4*</small>
            </div>
          </div>
          <p class="prose">
            <span>
              Description of the coding session
            </span>
          </p>
          <div class="flex justify-end w-full gap-2 mt-1">
            <button class="btn btn-sm bg-accent text-accent-content drop-shadow-md">
              <TerminalIcon class="w-4 mr-1" /> Run
            </button> 
            <button class="btn btn-sm bg-info text-info-content drop-shadow-md">
              <PlayIcon class="w-4 mr-1" /> Watch
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

export default {
  components: {
    Avatar,
    ThumbUpIcon,
    ThumbDownIcon,
    PlayIcon,
    TerminalIcon,
    PlusCircleIcon,
    CogIcon,
    CodingClinicDialog
  },
  props: ['search'],
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
      images: [
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
      ]
    }
  },
  methods: {
    onNewCodingClinic (template) {
      this.newCodingClinic = false
      console.log(template)
    }
  }
}
</script>