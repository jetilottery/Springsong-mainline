define(() => {

    function common(input) {
        var counts = {};
        var compare = 0;
        var mostFrequent;

        for (var i = 0, len = input.length; i < len; i++) {
            var word = input[i];

            if (counts[word] === undefined) {
                counts[word] = 1;
            } else {
                counts[word] = counts[word] + 1;
            }
            if (counts[word] > compare) {
                compare = counts[word];
                mostFrequent = input[i];
            }
        }
        return {mostCommon:mostFrequent,count:compare};
    }

    return {
        common
    };

});