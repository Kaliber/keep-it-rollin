/* track
!* viewState { ENUM } as overview or playing etc.
!* activeParts { trackPart } what trackparts are placed
!* date { Timestamp } what day is active (usually today)
*/

import moment from 'moment'
import firebase from 'firebase'
import { db } from '~/plugins/firebase'

export const state = () => ({
  activeParts: [],
  trackData: null,
  todaysDocRef: moment().format('DDMMYYYY')
})

export const mutations = {
  setTrack (stateMutation, trackDoc) {
    const sm = stateMutation

    sm.activeParts = trackDoc.trackParts

    const reducedTrackData = Object.keys(trackDoc)
      .reduce((obj, key) => {
        if (key !== 'trackParts') {
          obj[key] = trackDoc[key]
        }
        return obj
      }, {})

    sm.trackData = reducedTrackData
  },

  addTrackPart (stateMutation, trackPart) {
    const sm = stateMutation

    sm.activeParts.push(trackPart)
  }
}

export const actions = {
  async getTrack ({ commit, rootState }) {
    const track = await checkTrack(db.collection('users').doc(rootState.auth.userUid))
    commit('setTrack', track)
  },

  setTrackPart ({ commit, rootState }, trackPartData) {
    console.log('settrackpart', trackPartData)
    const docRefDate = moment().format('DDMMYYYY')
    const todaysTrack = db.collection('users').doc(rootState.auth.userUid).collection('tracks').doc(docRefDate)

    todaysTrack.update({
      trackParts: firebase.firestore.FieldValue.arrayUnion(trackPartData)
    }).catch((error) => {
      console.log(error)
    })

    commit('addTrackPart', trackPartData)
  }
}

export const getters = {
  //
}

// eslint-disable-next-line no-unused-vars
function checkTrack (ref) {
  const docRefDate = moment().format('DDMMYYYY')
  const todaysTrack = ref.collection('tracks').doc(docRefDate)

  return todaysTrack
    .get().then(
      (doc) => {
        if (doc.exists) {
          console.log('track exists', doc.data(), doc.data().createdAt.toDate())
          return doc.data()
        } else {
          console.log('track does not exist yet, first trackpart')
          const trackObject = {
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            trackParts: []
          }
          todaysTrack.set(trackObject)
          return trackObject
        }
      }
    )
}
