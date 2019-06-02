
    const idleStorageAccessor = {
      get: () => window.localStorage
    }

    function AlternativeStorage() {
      var storageMap = {};

      this.setItem = function (key, value) {
        storageMap[key] = value;
      };

      this.getItem = function (key) {
        if (typeof storageMap[key] !== 'undefined') {
          return storageMap[key];
        }
        return null;
      };

      this.removeItem = function (key) {
        storageMap[key] = undefined;
      };
    }

    function getStorage() {
      try {
        var s = idleStorageAccessor.get();
        s.setItem('idleStorage', '');
        s.removeItem('idleStorage');

        return s;
      } catch (err) {
        return new AlternativeStorage();
      }
    }

    var storage = getStorage();

    const store = {
      set: function (key, value) {
        storage.setItem('idle.' + key, JSON.stringify(value));
      },
      get: function (key) {
        return JSON.parse(storage.getItem('idle.' + key));
      },
      remove: function (key) {
        storage.removeItem('idle.' + key);
      },
      _wrapped: function () {
        return storage;
      }
    };

    export default store;
