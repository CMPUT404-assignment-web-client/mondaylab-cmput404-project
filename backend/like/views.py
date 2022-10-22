from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import response, status
from post.views import get_author_id, get_post_id, check_author_id
from post.models import Post
from author.models import Author
from like.models import Like
from django.db.models import Q
from like.Serializers import LikeSerializer
# Create your views here.


class LikesPostApiView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class=LikeSerializer
    def get(self, request, author_id, post_id):
        post_id = get_post_id(request)
        if check_author_id(request) == False:
            return response.Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            author_id = get_author_id(request)
            author = Author.objects.get(id = author_id)
            try:
                post = Post.objects.get(id = post_id, author=author)
                if post ==None:
                    return response.Response(f"1Error: {e}", status=status.HTTP_404_NOT_FOUND)
                post_like = Like.objects.filter(object = post.id)
                post_likes = self.serializer_class(post_like, many=True)
                result = {"type": "likes", "items": post_likes.data}
                return response.Response(result, status=status.HTTP_200_OK)
            except Exception as e:
                return response.Response(f"2Error: {e}", status=status.HTTP_404_NOT_FOUND)


