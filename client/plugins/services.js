import AnnouncementService from '~/services/announcement-service'
import FileService from '~/services/file-service'
import KeyboardService from '~/services/keyboard-service'
import ListingService from '~/services/listing-service'
import SearchService from '~/services/search-service'
import StatService from '~/services/stat-service'
import UserService from '~/services/user-service'
import PostService from '~/services/post-service'
import MessageService from '~/services/message-service'

export default ({ app }, inject) => {
	const services = {
		announcementService: new AnnouncementService(app.$api),
		fileService: new FileService(app.$api),
		keyboardService: new KeyboardService(app.$api),
		listingService: new ListingService(app.$api),
		searchService: new SearchService(app.$api),
		statService: new StatService(app.$api),
		userService: new UserService(app.$api),
		postService: new PostService(app.$api),
		messageService: new MessageService(app.$api)
	}

	inject('services', services)
}
