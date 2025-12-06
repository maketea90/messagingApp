login:
	@echo "--- Please complete the Firebase login in your browser ---"
	firebase login --no-localhost

init:
	firebase init firestore

rules:
	firebase deploy --only firestore

clean:
	@echo "--- Cleaning up generated files ---"
	rm -f .env .firebaserc

create-project:
	node setup-firebase.js

setup:
	@echo "--- Running Firebase Setup Script ---"
	${MAKE} login
	${MAKE} create-project
	${MAKE} rules