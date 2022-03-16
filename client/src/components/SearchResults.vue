<template>
  <div class="flex flex-col" v-if="search">
    <div class="navbar mb-2 shadow-lg">
      <div class="px-2 mx-2 flex-1">
        <div><span class="text-lg font-bold">{{ search.topic }}</span></div>
      </div>
      <div class="flex-none hidden px-2 mx-2 lg:flex" v-if="user">
        <div class="flex items-stretch">
          <a class="btn btn-ghost btn-sm rounded-btn"
            @click="newBlankClinic">
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
    </div>
    <div class="m-2 shadow-lg flex flex-col">
      <div class="p-2 flex" v-if="runningClinics">
        <TerminalIcon class="w-8 mr-2" />
        <div class="prose">
          <h3>Running clinics</h3>
        </div>
      </div>
      <OpenClinics class="p-2" v-if="runningClinics"
        @join-clinic="clinic => $emit('join-clinic', clinic)"
        @delete-clinic="clinic => deleteClinic = clinic"
      />
    </div>

    <div class="p-2 flex gap-4">
      <div class="flex flex-row text-primary drop-shadow-sm">
        <FireIcon class="w-6 mr-2" />
        <div class="prose">
          <div>Sponsored</div>
        </div>
      </div>
      <div class="flex flex-row text-secondary drop-shadow-sm">
        <AcademicCapIcon class="w-6 mr-2" />
        <div class="prose">
          <div>Free</div>
        </div>
      </div>
      <div class="flex flex-row text-info drop-shadow-sm">
        <BeakerIcon class="w-6 mr-2" />
        <div class="prose">
          <div>Data</div>
        </div>
      </div>
      <div class="flex flex-row text-warning drop-shadow-sm">
        <CodeIcon class="w-6 mr-2" />
        <div class="prose">
          <div>Coding/Web</div>
        </div>
      </div>
    </div>
    <div class="my-2" v-if="searchString"><i>results for: {{ searchString }}</i></div>

    <div class="p-2 grid grid-cols-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100">
      <div class="card rounded h-80 mr-4 cursor-pointer"
        v-for="(result, ix) in search.results" :key="ix"
        @mouseover="carrouselMe(result)"
        @mouseout="carrouselMe(null)"
      >
        <div @click="resultDialog = result">
          <div class="h-40 carousel rounded-box relative">
            <div class="w-full carousel-item"
              v-for="(mhtml, iix) in getResultMedia(result)" :key="iix"
              >
              <div v-html="mhtml" class="w-full"></div>
            </div>
            <div class="absolute w-full h-full"></div>
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
          </div>
        </div>
      </div> 
    </div>
    <CodingClinicDialog
      v-if="newCodingClinic"
      :clinicTemplates="clinicTemplates"
      @ok="onNewCodingClinic"
      @cancel="newCodingClinic = false"
    />
    <CodingClinicTemplate
      @close="resultDialog = null"
      @ok="resultDialog = null"
      @run="runClinicTemplate(resultDialog)"
      v-if="resultDialog"
      :template="resultDialog"
      :media="getResultMedia(resultDialog)"
    />
    <DeleteClinicDialog
      :clinic="deleteClinic"
      @ok="onDeleteClinic"
      @cancel="deleteClinic = null"
      v-if="deleteClinic"
    />
  </div>
</template>
<script>
import {
  ThumbUpIcon,
  ThumbDownIcon,
  PlayIcon,
  PlusCircleIcon,
  CogIcon,
  FireIcon,
  TerminalIcon,
  AcademicCapIcon,
  BeakerIcon,
  CodeIcon
} from '@heroicons/vue/outline'
import Avatar from '@/components/Avatar.vue'
import CodingClinicDialog from '@/components/CodingClinicDialog.vue'
import CodingClinicTemplate from '@/components/CodingClinicTemplate.vue'
import OpenClinics from '@/components/OpenClinics.vue'
import DeleteClinicDialog from '@/components/DeleteClinicDialog.vue'
export default {
  components: {
    Avatar,
    ThumbUpIcon,
    ThumbDownIcon,
    PlayIcon,
    TerminalIcon,
    PlusCircleIcon,
    CogIcon,
    FireIcon,
    AcademicCapIcon,
    BeakerIcon,
    CodeIcon,
    CodingClinicDialog,
    CodingClinicTemplate,
    OpenClinics,
    DeleteClinicDialog
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
      resultDialog: null,
      carrouselMeTarget: null,
      slidInterval: null,
      clinicTemplates: null,
      deleteClinic: null
    }
  },
  computed: {
    user () {
      return this.$storex.user.user
    },
    search () {
      const { currentSearch } = this.$storex.search
      return currentSearch
    },
    searchString () {
      const { search: { query: { q } = {}} } = this
      return q
    },
    runningClinics () {
      return !!this.$storex.clinic.clinics?.length
    }
  },
  methods: {
    async onNewCodingClinic (settings) {
      this.$emit('new-clinic', settings)
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
      if (!this.$root.login()) return
      this.clinicTemplates = [result]
      this.newCodingClinic = true
    },
    carrouselMe(result) {
      if (this.carrouselMeTarget !== result) {
        this.carrouselMeTarget = result
        this.slideResultMedia ()
      }
    },
    slideResultMedia (shift) {
      clearTimeout(this.slidInterval)
      const { media } = this.carrouselMeTarget || {}
      if (!media || media.length === 1) {
        return
      }
      shift ? media.push(media.shift()) : setTimeout(() => media.push(media.shift()), 1000)
      this.slidInterval = setTimeout(() => this.slideResultMedia(true), 4000)
    },
    newBlankClinic () {
      this.clinicTemplates = null
      this.newCodingClinic = true
    },
    onDeleteClinic () {
      this.$emit('delete-clinic', this.deleteClinic)
      this.deleteClinic = null
    }
  }
}
</script>