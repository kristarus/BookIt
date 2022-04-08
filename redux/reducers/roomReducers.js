import {
  ALL_ROOMS_SUCCESS,
  ALL_ROOMS_FAIL,
  CLEAR_ERRORS,
  ROOM_DETAILS_SUCCESS,
  ROOM_DETAILS_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_RESET,
  NEW_REVIEW_FAIL,
  REVIEW_AVAILABILITY_REQUEST,
  REVIEW_AVAILABILITY_SUCCESS,
  REVIEW_AVAILABILITY_FAIL,
  ADMIN_ROOMS_REQUEST,
  ADMIN_ROOMS_SUCCESS,
  ADMIN_ROOMS_FAIL,
  NEW_ROOM_REQUEST,
  NEW_ROOM_SUCCESS,
  NEW_ROOM_RESET,
  NEW_ROOM_FAIL,
  UPDATE_ROOM_SUCCESS,
  UPDATE_ROOM_RESET,
  UPDATE_ROOM_FAIL,
  DELETE_ROOM_SUCCESS,
  DELETE_ROOM_RESET,
  DELETE_ROOM_REQUEST,
  DELETE_ROOM_FAIL,
  GET_REVIEWS_REQUEST,
  GET_REVIEWS_SUCCESS,
  GET_REVIEWS_FAIL,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_RESET,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_FAIL,
} from "../constants/roomConstants";

// all rooms reducer
export const allRoomsReducer = (state = { rooms: [] }, action) => {
  switch (action.type) {
    case ADMIN_ROOMS_REQUEST:
      return {
        loading: true,
      };
    case ADMIN_ROOMS_SUCCESS:
      return {
        rooms: action.payload,
        loading: false,
      };
    case ALL_ROOMS_SUCCESS:
      return {
        roomsCount: action.payload.roomsCount,
        resPerPage: action.payload.resPerPage,
        filteredRoomsCount: action.payload.filteredRoomsCount,
        rooms: action.payload.rooms,
      };
    case ALL_ROOMS_FAIL:
    case ADMIN_ROOMS_FAIL:
      return {
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// room details reducer
export const roomDetailsReducer = (state = { rooms: [] }, action) => {
  switch (action.type) {
    case ROOM_DETAILS_SUCCESS:
      return {
        rooms: action.payload,
      };
    case ROOM_DETAILS_FAIL:
      return {
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// new room reducer
export const newRoomReducer = (state = { room: {} }, action) => {
  switch (action.type) {
    case NEW_ROOM_RESET:
      return {
        loading: false,
        success: false,
      };
    case NEW_ROOM_REQUEST:
      return {
        loading: true,
      };
    case NEW_ROOM_SUCCESS:
      return {
        success: action.payload.success,
        rooms: action.payload.room,
        loading: false,
      };
    case NEW_ROOM_FAIL:
      return {
        error: action.payload,
        loading: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// new review reducer
export const newReviewReducer = (state = { rooms: [] }, action) => {
  switch (action.type) {
    case NEW_REVIEW_RESET:
      return {
        loading: false,
        success: false,
      };
    case NEW_REVIEW_REQUEST:
      return {
        loading: true,
      };
    case NEW_REVIEW_SUCCESS:
      return {
        success: action.payload,
        loading: false,
      };
    case NEW_REVIEW_FAIL:
      return {
        error: action.payload,
        loading: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// check review reducer
export const checkReviewReducer = (state = { rooms: [] }, action) => {
  switch (action.type) {
    case REVIEW_AVAILABILITY_REQUEST:
      return {
        loading: true,
      };
    case REVIEW_AVAILABILITY_SUCCESS:
      return {
        reviewAvailable: action.payload,
        loading: false,
      };
    case REVIEW_AVAILABILITY_FAIL:
      return {
        error: action.payload,
        loading: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// new review reducer
export const roomReducer = (state = { rooms: [] }, action) => {
  switch (action.type) {
    case UPDATE_ROOM_RESET:
      return {
        loading: false,
        isDeleted: false,
      };
    case DELETE_ROOM_RESET:
      return {
        loading: false,
        isUpdated: false,
      };
    case DELETE_ROOM_REQUEST:
      return {
        loading: true,
      };
    case UPDATE_ROOM_SUCCESS:
      return {
        isUpdated: action.payload,
        loading: false,
      };
    case DELETE_ROOM_SUCCESS:
      return {
        isDeleted: action.payload,
        loading: false,
      };
    case UPDATE_ROOM_FAIL:
    case DELETE_ROOM_FAIL:
      return {
        error: action.payload,
        loading: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// room reviews reducer
export const roomReviewsReducer = (state = { reviews: [] }, action) => {
  switch (action.type) {
    case GET_REVIEWS_REQUEST:
      return {
        loading: true,
      };
    case GET_REVIEWS_SUCCESS:
      return {
        reviews: action.payload,
        loading: false,
      };
    case GET_REVIEWS_FAIL:
      return {
        error: action.payload,
        loading: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// new review reducer
export const reviewReducer = (state = { rooms: [] }, action) => {
  switch (action.type) {
    case DELETE_REVIEW_RESET:
      return {
        loading: false,
        isDeleted: false,
      };
    case DELETE_REVIEW_REQUEST:
      return {
        loading: true,
      };
    case DELETE_REVIEW_SUCCESS:
      return {
        isDeleted: action.payload,
        loading: false,
      };
    case DELETE_REVIEW_FAIL:
      return {
        error: action.payload,
        loading: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
